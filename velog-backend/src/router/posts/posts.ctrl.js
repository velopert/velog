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
  checkEmpty,
  refreshSitemap,
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
import UrlSlugHistory from 'database/models/UrlSlugHistory';

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
      .trim()
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
    urlSlug: Joi.string()
      .trim()
      .min(1)
      .max(130),
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

  const uniqueUrlSlug = escapeForUrl(`${title} ${generateSlugId()}`);
  const userUserSlug = urlSlug ? escapeForUrl(urlSlug) : '';

  let processedSlug = urlSlug ? userUserSlug : uniqueUrlSlug;
  if (urlSlug) {
    try {
      const exists = await Post.checkUrlSlugExistancy({
        userId: ctx.user.id,
        urlSlug,
      });
      console.log(exists);
      if (exists > 0) {
        processedSlug = uniqueUrlSlug;
      }
    } catch (e) {
      ctx.throw(500, e);
    }
  }

  const stringsToCheck = [title, body, ...tags];
  for (let i = 0; i < stringsToCheck.length; i++) {
    if (checkEmpty(stringsToCheck[i])) {
      ctx.status = 400;
      ctx.body = {
        name: 'INVALID_TEXT',
      };
      return;
    }
  }

  if (processedSlug === '' || processedSlug.replace(/\./g, '') === '') {
    ctx.status = 400;
    ctx.body = {
      name: 'INVALID_URL_SLUG',
    };
    return;
  }
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
      url_slug: processedSlug,
      meta,
    }).save();

    const postId = post.id;
    await PostsTags.link(postId, tagIds);
    await PostsCategories.link(postId, uniqueCategories);

    // const categoriesInfo = await PostsCategories.findCategoriesByPostId(postId);

    const postData = await Post.readPostById(postId);
    const serialized = serializePost(postData);

    ctx.body = serialized;

    setTimeout(() => {
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
      refreshSitemap();
    }, 0);
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const readPost = async (ctx: Context): Promise<*> => {
  const { username, urlSlug } = ctx.params;
  try {
    console.time('readPost');
    let post = await Post.readPost(username, urlSlug);
    console.timeEnd('readPost');
    if (!post) {
      // try using urlslugHistory
      const user = await User.findUser('username', username);
      if (!user) {
        ctx.status = 404;
        return;
      }
      const history = await UrlSlugHistory.findOne({
        where: {
          url_slug: urlSlug,
          fk_user_id: user.id,
        },
        order: [['created_at', 'DESC']],
      });
      if (!history) {
        ctx.status = 404;
        return;
      }
      console.time('readPostById');
      post = await Post.readPostById(history.fk_post_id);
      console.timeEnd('readPostById');
      if (!post) {
        ctx.status = 404;
        return;
      }
    }

    console.time('getCommentsCount');
    const commentsCount = await Comment.getCommentsCount(post.id);
    console.timeEnd('getCommentsCount');
    let liked = false;
    if (ctx.user) {
      console.time('checkLikeExists');
      const exists = await PostLike.checkExists({
        userId: ctx.user.id,
        postId: post.id,
      });
      console.timeEnd('checkLikeExists');
      liked = !!exists;
    }

    ctx.body = serializePost({
      ...post.toJSON(),
      comments_count: commentsCount,
      liked,
    });

    setTimeout(async () => {
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
    }, 5);
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

export const listSequences = async (ctx: Context) => {
  const { post_id } = ctx.query;
  console.log(ctx.query);
  if (!isUUID(post_id)) {
    ctx.status = 400;
    ctx.body = {
      name: 'NOT_UUID',
    };
    return;
  }
  try {
    const post = await Post.findById(post_id, {
      attributes: [
        'id',
        'title',
        'body',
        'meta',
        'url_slug',
        'fk_user_id',
        'created_at',
      ],
      raw: true,
    });
    if (!post) {
      ctx.status = 404;
      return;
    }
    const { fk_user_id } = post;
    const promises = [];
    // loads posts before post
    promises.push(Post.findAll({
      order: [['created_at', 'asc']],
      attributes: ['id', 'title', 'body', 'meta', 'url_slug', 'created_at'],
      where: {
        fk_user_id,
        created_at: {
          // $FlowFixMe
          [Op.gt]: post.created_at,
        },
        is_temp: false,
      },
      raw: true,
      limit: 4,
    }));
    // loads posts after post
    promises.push(Post.findAll({
      order: [['created_at', 'desc']],
      attributes: ['id', 'title', 'body', 'meta', 'url_slug', 'created_at'],
      where: {
        fk_user_id,
        created_at: {
          // $FlowFixMe
          [Op.lt]: post.created_at,
        },
        is_temp: false,
      },
      limit: 4,
      raw: true,
    }));
    const [before, after] = await Promise.all(promises);

    before.reverse();
    delete post.fk_user_id;

    const beforeCount = after.length < 2 ? 4 - after.length : 2;
    const afterCount = before.length < 2 ? 4 - before.length : 2;

    ctx.body = [
      ...before.slice(before.length - beforeCount, before.length),
      post,
      ...after.slice(0, afterCount),
    ].map(p => ({ ...p, body: formatShortDescription(p.body) }));
  } catch (e) {
    ctx.throw(500, e);
  }
};
