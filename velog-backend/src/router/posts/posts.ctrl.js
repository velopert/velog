// @flow

import type { Context } from 'koa';
import Joi from 'joi';
import {
  validateSchema,
  filterUnique,
  generateSlugId,
  escapeForUrl,
  isUUID,
  formatShortDescription,
  generalHash,
} from 'lib/common';
import {
  Category,
  Post,
  PostsCategories,
  PostsTags,
  Tag,
  User,
  UserProfile,
  Comment,
  FollowUser,
  FollowTag,
  Feed,
  PostLike,
  PostScore,
  PostRead,
} from 'database/models';

import { serializePost, type PostModel } from 'database/models/Post';
import Sequelize from 'sequelize';
import removeMd from 'remove-markdown';
import { TYPES } from 'database/models/PostScore';
import db from 'database/db';
import { getCommentCountsOfPosts } from 'database/rawQuery/comments';
import {
  getTrendingPostScore,
  getTrendingPosts,
} from 'database/rawQuery/trending';
import redisClient from 'lib/redisClient';

const { Op } = Sequelize;

type CreateFeedsParams = {
  postId: string,
  userId: string,
  tags: { id: string, name: string }[],
  username: string,
};

function convertMapToObject(m: Map<string, *>): any {
  const obj = {};
  m.forEach((v, k) => {
    obj[k] = v;
  });
  return obj;
}
async function createFeeds({
  postId,
  userId,
  tags,
  username,
}: CreateFeedsParams): Promise<*> {
  // TODO:

  const usersMap = new Map();

  // 1. USER FOLLOW
  try {
    const followers = await FollowUser.findAll({
      attributes: ['fk_user_id'],
      where: { fk_follow_user_id: userId },
      raw: true,
    });

    followers.forEach(({ fk_user_id }) => {
      usersMap.set(fk_user_id, [{ type: 'USER', value: username }]);
    });
  } catch (e) {
    console.log(e);
  }
  // 2. TAG FOLLOW (FOR EACH)
  try {
    const results = await Promise.all(tags.map(({ id }) => {
      return FollowTag.findAll({
        attributes: ['fk_user_id'],
        where: { fk_tag_id: id },
        raw: true,
      });
    }));
    results.forEach((followers, i) => {
      const tagName = tags[i].name;
      followers.forEach(({ fk_user_id }) => {
        const exists = usersMap.get(fk_user_id);
        const reason = { type: 'TAG', value: tagName };
        if (exists) {
          exists.push(reason);
        } else {
          usersMap.set(fk_user_id, [reason]);
        }
      });
    });
  } catch (e) {
    console.log(e);
  }
  // console.log(convertMapToObject(usersMap));
  const userIds = [...usersMap.keys()];
  const feeds = userIds.map(u => ({
    fk_post_id: postId,
    fk_user_id: u,
    reason: usersMap.get(u),
  }));
  await Feed.bulkCreate(feeds);
  // 3. Create Feeds
  // 4. Short Polling
}

export const writePost = async (ctx: Context): Promise<*> => {
  type BodySchema = {
    title: string,
    body: string,
    shortDescription: string,
    thumbnail: string,
    isMarkdown: boolean,
    isTemp: boolean,
    meta: any,
    categories: Array<string>,
    tags: Array<string>,
    urlSlug: string,
  };

  const schema = Joi.object().keys({
    title: Joi.string()
      .required()
      .min(1)
      .max(120),
    body: Joi.string()
      .required()
      .min(1),
    shortDescription: Joi.string(),
    thumbnail: Joi.string()
      .uri()
      .allow(null),
    isMarkdown: Joi.boolean().required(),
    isTemp: Joi.boolean().required(),
    meta: Joi.object(),
    categories: Joi.array()
      .items(Joi.string())
      .required(),
    tags: Joi.array()
      .items(Joi.string())
      .required(),
    urlSlug: Joi.string().max(130),
  });

  if (!validateSchema(ctx, schema)) {
    return;
  }

  const {
    title,
    body,
    shortDescription,
    thumbnail,
    isMarkdown,
    isTemp,
    meta,
    categories,
    tags,
    urlSlug,
  }: BodySchema = (ctx.request.body: any);

  const generatedUrlSlug = `${title} ${generateSlugId()}`;
  const escapedUrlSlug = escapeForUrl(urlSlug || generatedUrlSlug);
  const replaceDashToSpace = text => text.replace(/-/g, ' ');
  // TODO: validate url slug

  const uniqueTags: Array<string> = filterUnique(tags); // .map(replaceDashToSpace);
  const uniqueCategories: Array<string> = filterUnique(categories);

  try {
    // check: all categories are valid
    const ownCategories = await Category.listAllCategories(ctx.user.id);
    for (let i = 0; i < uniqueCategories.length; i++) {
      const categoryId = uniqueCategories[i];
      if (ownCategories.findIndex(c => c.id === categoryId) === -1) {
        ctx.status = 400;
        ctx.body = {
          name: 'INVALID_CATEGORY',
          payload: categoryId,
        };
        return;
      }
    }

    const tagIds = await Promise.all(uniqueTags.map(tag => Tag.getId(tag)));
    // create Post data
    const post = await Post.build({
      title,
      body,
      short_description: shortDescription,
      thumbnail,
      is_markdown: isMarkdown,
      is_temp: isTemp,
      fk_user_id: ctx.user.id,
      url_slug: escapedUrlSlug,
      meta,
    }).save();

    const postId = post.id;
    await PostsTags.link(postId, tagIds);
    await PostsCategories.link(postId, uniqueCategories);

    // const categoriesInfo = await PostsCategories.findCategoriesByPostId(postId);

    const postData = await Post.readPostById(postId);
    const serialized = serializePost(postData);

    ctx.body = serialized;

    if (!isTemp) {
      const tagData = tagIds.map((tagId, index) => ({
        id: tagId,
        name: uniqueTags[index],
      }));
      createFeeds({
        postId,
        userId: ctx.user.id,
        username: ctx.user.username,
        tags: tagData,
      });
    }
    redisClient.remove('/recent');
    redisClient.remove(`/@${ctx.user.username}`);
    tags.forEach((tag) => {
      redisClient.remove(`/tags/${tag}`);
      redisClient.remove(`/@${ctx.user.username}/tags/${tag}`);
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const readPost = async (ctx: Context): Promise<*> => {
  const { username, urlSlug } = ctx.params;
  try {
    const post = await Post.readPost(username, urlSlug);
    if (!post) {
      ctx.status = 404;
      return;
    }
    const commentsCount = await Comment.getCommentsCount(post.id);

    let liked = false;
    if (ctx.user) {
      const exists = await PostLike.checkExists({
        userId: ctx.user.id,
        postId: post.id,
      });
      liked = !!exists;
    }

    ctx.body = serializePost({
      ...post.toJSON(),
      comments_count: commentsCount,
      liked,
    });
    const hash = generalHash(ctx.request.ip);
    const userId = ctx.user ? ctx.user.id : null;

    const postRead = await PostRead.findOne({
      where: {
        ip_hash: hash,
        fk_post_id: post.id,
        created_at: {
          // $FlowFixMe
          [Op.gt]: new Date(new Date() - 24 * 60 * 60 * 1000),
        },
      },
    });

    if (postRead) {
      return;
    }

    await PostRead.create({
      ip_hash: hash,
      fk_post_id: post.id,
      fk_user_id: userId,
    });

    await post.increment('views', { by: 1 });
    if (post.views % 10 === 0) {
      await PostScore.create({
        type: TYPES.READ,
        fk_user_id: null,
        fk_post_id: post.id,
        score: 0.125,
      });
    }
  } catch (e) {
    ctx.throw(500, e);
  }
};

function injectCommentCounts(posts, commentCounts) {
  // inject postCount
  return posts.map((p) => {
    const row = commentCounts.find(cc => cc.fk_post_id === p.id);
    const count = row ? row.comments_count : 0;
    return {
      ...p,
      comments_count: count,
    };
  });
}
export const listPosts = async (ctx: Context): Promise<*> => {
  const { username } = ctx.params;
  const {
    category, tag, cursor, is_temp,
  } = ctx.query;

  const query = {
    username,
    categoryUrlSlug: category,
    tag,
    cursor,
    isTemp: is_temp === 'true',
  };

  if (cursor && !isUUID(cursor)) {
    ctx.body = {
      type: 'INVALID_CURSOR_ID',
    };
    ctx.status = 400;
    return;
  }

  if (is_temp === 'true') {
    if (!ctx.user) {
      ctx.status = 401;
      return;
    }
    if (ctx.user.username !== username) {
      ctx.status = 403;
      return;
    }
  }

  try {
    const result = await Post.listPosts(query);
    if (!result.data) {
      ctx.body = [];
      return;
    }
    const data = result.data
      .map(serializePost)
      .map(post => ({ ...post, body: formatShortDescription(post.body) }));

    const commentCounts = await getCommentCountsOfPosts(result.data.map(p => p.id));

    ctx.body = injectCommentCounts(data, commentCounts);

    ctx.set('Count', result.count.toString());
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const listTrendingPosts = async (ctx: Context) => {
  const { option, cursor } = ctx.query;
  // check cursor
  try {
    let score = 0;
    if (cursor) {
      if (!isUUID(cursor)) {
        ctx.body = 'NOT_UUID';
        ctx.status = 400;
        return;
      }
      score = await getTrendingPostScore(cursor);
      if (!score) {
        ctx.body = {
          type: 'INVALID_CURSOR_ID',
        };
        ctx.status = 400;
        return;
      }
    }
    const postIds = await getTrendingPosts(cursor
      ? {
        id: cursor,
        score,
      }
      : null);
    if (!postIds || postIds.length === 0) {
      ctx.body = [];
      return;
    }
    const posts = await Post.readPostsByIds(postIds.map(postId => postId.post_id));
    const data = posts
      .map(serializePost)
      .map(post => ({ ...post, body: formatShortDescription(post.body) }));

    // retrieve commentCounts and inject
    const commentCounts = await getCommentCountsOfPosts(posts.map(p => p.id));
    ctx.body = injectCommentCounts(data, commentCounts);
  } catch (e) {
    ctx.throw(500, e);
  }
};
