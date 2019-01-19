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
  SeriesPosts,
  Series,
} from 'database/models';

import { serializePost, type PostModel } from 'database/models/Post';
import Sequelize from 'sequelize';
import removeMd from 'remove-markdown';
import { TYPES } from 'database/models/PostScore';
import db from 'database/db';
import { getCommentCountsOfPosts } from 'database/rawQuery/comments';
import { getTrendingPosts } from 'database/rawQuery/trending';
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
    thumbnail: string,
    is_temp: boolean,
    meta: any,
    categories: Array<string>,
    tags: Array<string>,
    url_slug: string,
    is_private: ?boolean, // until update
    series_id: ?string,
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
    thumbnail: Joi.string()
      .uri()
      .allow(null),
    is_temp: Joi.boolean().required(),
    is_private: Joi.boolean(),
    meta: Joi.object(),
    categories: Joi.array()
      .items(Joi.string())
      .required(),
    tags: Joi.array()
      .items(Joi.string())
      .required(),
    url_slug: Joi.string()
      .trim()
      .min(1)
      .max(130),
    series_id: Joi.string().allow(null),
  });

  if (!validateSchema(ctx, schema)) {
    return;
  }

  const {
    title,
    body,
    thumbnail,
    is_temp,
    is_private,
    meta,
    categories,
    tags,
    url_slug,
    series_id,
  }: BodySchema = (ctx.request.body: any);

  const uniqueUrlSlug = escapeForUrl(`${title} ${generateSlugId()}`);
  const userUserSlug = url_slug ? escapeForUrl(url_slug) : '';

  let processedSlug = url_slug ? userUserSlug : uniqueUrlSlug;
  if (url_slug) {
    try {
      const exists = await Post.checkUrlSlugExistancy({
        userId: ctx.user.id,
        urlSlug: url_slug,
      });
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
      thumbnail,
      is_markdown: true,
      fk_user_id: ctx.user.id,
      url_slug: processedSlug,
      is_temp,
      is_private: is_private || false,
      meta,
    }).save();

    const postId = post.id;
    await PostsTags.link(postId, tagIds);
    await PostsCategories.link(postId, uniqueCategories);

    if (series_id) {
      const series = await Series.findById(series_id);
      if (!series) {
        ctx.status = 404;
        ctx.body = {
          name: 'INVALID_SERIES',
        };
        return;
      }
      if (series.fk_user_id !== ctx.user.id) {
        ctx.status = 403;
        return;
      }
      series.changed('updated_at', true);
      await series.save();
      await SeriesPosts.append(series_id, post.id, ctx.user.id);
    }

    // const categoriesInfo = await PostsCategories.findCategoriesByPostId(postId);

    const postData = await Post.readPostById(postId);
    const serialized = serializePost(postData);

    ctx.body = serialized;

    setTimeout(() => {
      if (!is_temp) {
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
    let post = await Post.readPost(username, urlSlug);
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
      post = await Post.readPostById(history.fk_post_id);
      if (!post) {
        ctx.status = 404;
        return;
      }
    }
    if (
      post.is_private === true &&
      (ctx.user && ctx.user.username) !== username
    ) {
      ctx.status = 404;
      return;
    }

    const [commentsCount, seriesPost] = await Promise.all([
      Comment.getCommentsCount(post.id),
      SeriesPosts.findOne({
        where: {
          fk_post_id: post.id,
        },
        include: [Series],
      }),
    ]);

    let seriesLength = 0;
    let list = null;
    if (seriesPost) {
      const seriesPosts = await SeriesPosts.findAll({
        where: {
          fk_series_id: seriesPost.fk_series_id,
        },
        include: [
          {
            model: Post,
            attributes: ['id', 'url_slug', 'title'],
          },
        ],
        order: [['index', 'ASC']],
      });
      seriesLength = seriesPosts.length;
      list = seriesPosts.map(sp => ({
        index: sp.index,
        id: sp.fk_post_id,
        title: sp.post.title,
        url_slug: sp.post.url_slug,
      }));
    }
    let liked = false;
    if (ctx.user) {
      const exists = await PostLike.checkExists({
        userId: ctx.user.id,
        postId: post.id,
      });
      liked = !!exists;
    }

    const serialized = serializePost({
      ...post.toJSON(),
      comments_count: commentsCount,
      liked,
    });


    ctx.body = {
      ...serialized,
      series: seriesPost
        ? {
          id: seriesPost.series.id,
          name: seriesPost.series.name,
          url_slug: seriesPost.series.url_slug,
          index: seriesPost.index,
          thumbnail: seriesPost.series.thumbnail,
          description: seriesPost.series.description,
          length: seriesLength,
          list,
        }
        : null,
    };

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
  const userId = ctx.user ? ctx.user.id : null;

  const query = {
    username,
    categoryUrlSlug: category,
    tag,
    cursor,
    isTemp: is_temp === 'true',
    userId,
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
  const { option } = ctx.query;
  if (isNaN(ctx.query.offset || 0)) {
    ctx.body = {
      type: 'INVALID_OFFSET',
    };
    ctx.status = 400;
    return;
  }
  const offset = parseInt(ctx.query.offset || 0, 10);

  // check cursor
  try {
    const postIds = await getTrendingPosts(offset || 0);
    if (!postIds || postIds.length === 0) {
      ctx.body = [];
      return;
    }
    const posts = await Post.readPostsByIds(postIds.map(postId => postId.post_id));
    const filtered = posts.filter(p => !p.is_private);
    const data = filtered
      .map(serializePost)
      .map(post => ({ ...post, body: formatShortDescription(post.body) }));

    // retrieve commentCounts and inject
    const commentCounts = await getCommentCountsOfPosts(filtered.map(p => p.id));
    ctx.body = injectCommentCounts(data, commentCounts);
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const listSequences = async (ctx: Context) => {
  const { post_id } = ctx.query;
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
        'released_at',
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
      attributes: [
        'id',
        'title',
        'body',
        'meta',
        'url_slug',
        'created_at',
        'released_at',
      ],
      where: {
        fk_user_id,
        created_at: {
          // $FlowFixMe
          [Op.gt]: post.created_at,
        },
        is_temp: false,

        // is_private=false or ownPost
        // $FlowFixMe
        [Op.or]: {
          is_private: false,
          // $FlowFixMe
          ...(ctx.user
            ? {
              // $FlowFixMe
              [Op.and]: {
                is_private: true,
                fk_user_id: ctx.user.id,
              },
            }
            : {}),
        },
      },
      raw: true,
      limit: 4,
    }));
    // loads posts after post
    promises.push(Post.findAll({
      order: [['created_at', 'desc']],
      attributes: [
        'id',
        'title',
        'body',
        'meta',
        'url_slug',
        'created_at',
        'released_at',
      ],
      where: {
        fk_user_id,
        created_at: {
          // $FlowFixMe
          [Op.lt]: post.created_at,
        },
        is_temp: false,
        // $FlowFixMe
        [Op.or]: {
          is_private: false,
          // $FlowFixMe
          ...(ctx.user
            ? {
              // $FlowFixMe
              [Op.and]: {
                is_private: true,
                fk_user_id: ctx.user.id,
              },
            }
            : {}),
        },
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
