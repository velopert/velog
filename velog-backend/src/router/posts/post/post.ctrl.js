// @flow
import type { Context } from 'koa';
import { serializePost } from 'database/models/Post';
import db from 'database/db';
import Joi from 'joi';
import {
  validateSchema,
  generateSlugId,
  escapeForUrl,
  extractKeys,
  checkEmpty,
} from 'lib/common';
import { diff } from 'json-diff';
import {
  Post,
  PostLike,
  PostsTags,
  PostsCategories,
  Category,
  Series,
  SeriesPosts,
} from 'database/models';
import redisClient from 'lib/redisClient';
import UrlSlugHistory from 'database/models/UrlSlugHistory';
import { subtractIndexes } from 'database/rawQuery/series';

export const checkPostExistancy = async (
  ctx: Context,
  next: () => Promise<*>,
): Promise<*> => {
  const { id } = ctx.params;
  try {
    const post = await Post.findById(id);
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.post = post;
  } catch (e) {
    ctx.throw(500, e);
    return;
  }
  return next();
};

export const checkPostOwnership = (ctx: Context, next: () => Promise<*>) => {
  const { post, user } = ctx;
  if (post.fk_user_id !== user.id) {
    ctx.status = 403;
    ctx.body = {
      name: 'NO_PERMISSION',
    };
    return;
  }
  return next();
};

export const updatePost = async (ctx: Context): Promise<*> => {
  /*
    - title ✅
    - body ✅
    - tags
    - categories
    - url_slug ✅
    - thumbnail ✅
    - is_temp ✅
  */
  type BodySchema = {
    title: string,
    body: string,
    tags: Array<string>,
    categories: Array<string>,
    url_slug: string,
    thumbnail: string,
    is_temp: boolean,
    meta: any,
    is_private: boolean,
    series_id: ?string,
  };

  const schema = Joi.object().keys({
    title: Joi.string()
      .trim()
      .min(1)
      .max(120),
    body: Joi.string().min(1),
    thumbnail: Joi.string()
      .uri()
      .allow(null),
    is_temp: Joi.boolean(),
    categories: Joi.array().items(Joi.string()),
    tags: Joi.array().items(Joi.string()),
    url_slug: Joi.string()
      .trim()
      .min(1)
      .max(130),
    meta: Joi.object(),
    is_private: Joi.boolean(),
    series_id: Joi.string().allow(null),
  });

  if (!validateSchema(ctx, schema)) {
    return;
  }

  const {
    title,
    body,
    tags,
    categories,
    url_slug: urlSlug,
    thumbnail,
    is_temp: isTemp,
    meta,
    is_private,
    series_id,
  }: BodySchema = (ctx.request.body: any);

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

  // validate tags
  if (tags) {
    for (let i = 0; i < tags.length; i++) {
      if (tags[i].length > 25) {
        ctx.status = 400;
        ctx.body = {
          name: 'TAG_TOO_LONG',
        };
      }
    }
  }

  const generatedUrlSlug = escapeForUrl(`${title} ${generateSlugId()}`);
  const userUrlSlug = escapeForUrl(urlSlug || '');

  const { id } = ctx.params;

  // TODO: urlSlug change feature
  const urlSlugShouldChange = urlSlug !== ctx.post.url_slug;
  let processedSlug = urlSlug ? userUrlSlug : generatedUrlSlug;
  // current !== received -> check urlSlugExistancy
  if (urlSlugShouldChange) {
    const exists = await Post.checkUrlSlugExistancy({
      userId: ctx.user.id,
      urlSlug: userUrlSlug,
    });
    if (exists > 0) {
      processedSlug = generatedUrlSlug;
    }

    if (processedSlug === '' || processedSlug.replace(/\./g, '') === '') {
      ctx.status = 400;
      ctx.body = {
        name: 'INVALID_URL_SLUG',
      };
      return;
    }

    // create urlSlughistory
    const history = UrlSlugHistory.build({
      fk_post_id: ctx.post.id,
      fk_user_id: ctx.user.id,
      url_slug: ctx.post.url_slug,
    });

    try {
      await history.save();
    } catch (e) {
      ctx.throw(500, e);
    }
  }

  const updateQuery = {
    title,
    body,
    url_slug: urlSlugShouldChange ? processedSlug : undefined,
    thumbnail,
    is_temp: isTemp,
    meta,
    is_private: is_private || false,
    released_at: !isTemp && ctx.post.is_temp ? new Date() : undefined,
  };

  Object.keys(updateQuery).forEach((key) => {
    if (updateQuery[key] === undefined) {
      delete updateQuery[key];
    }
  });

  // Update Series
  let series = null;
  try {
    const seriesPost = await SeriesPosts.findOne({
      where: { fk_post_id: id },
      include: [Series],
    });
    // Check Series Validity
    if (series_id) {
      const nextSeries = await Series.findById(series_id);
      if (!nextSeries) {
        ctx.status = 404;
        ctx.body = {
          name: 'INVALID_SERIES',
        };
      }
      if (nextSeries.fk_user_id !== ctx.user.id) {
        ctx.status = 403;
        return;
      }
      series = {
        id: nextSeries.id,
        name: nextSeries.name,
      };
    }

    if (seriesPost) {
      if (seriesPost.series.id !== series_id) {
        seriesPost.destroy();
        subtractIndexes(seriesPost.series.id, seriesPost.index);
        if (!series_id) {
          series = null;
        } else {
          await SeriesPosts.append(series_id, id, ctx.user.id);
        }
      }
    } else if (series_id) {
      await SeriesPosts.append(series_id, id, ctx.user.id);
    }
  } catch (e) {
    ctx.throw(500, e);
  }

  // Update Tags
  if (tags) {
    // Check which tags to remove or add
    const currentTags = await ctx.post.getTagNames();
    const tagNames = currentTags.tags.map(tag => tag.name);
    const tagDiff = diff(tagNames.sort(), tags.sort()) || [];

    const tagsToRemove = tagDiff
      .filter(info => info[0] === '-')
      .map(info => info[1]);
    const tagsToAdd = tagDiff
      .filter(info => info[0] === '+')
      .map(info => info[1]);

    try {
      await PostsTags.removeTagsFromPost(id, tagsToRemove);
      await PostsTags.addTagsToPost(id, tagsToAdd);
    } catch (e) {
      ctx.throw(e);
    }
  }

  // Update Categories
  if (categories) {
    try {
      // Verify categories
      const count = await Category.count({
        where: {
          id: {
            $or: categories,
          },
          fk_user_id: ctx.user.id,
        },
      });
      if (count !== categories.length && categories.length !== 0) {
        ctx.status = 409;
        ctx.body = {
          name: 'NOT_OWN_CATEGORY',
        };
        return;
      }

      // check which categories to remove or add
      const currentCategories = await ctx.post.getCategoryIds();
      const categoryDiff =
        diff(currentCategories.sort(), categories.sort()) || [];
      const categoriesToRemove = categoryDiff
        .filter(info => info[0] === '-')
        .map(info => info[1]);
      const categoriesToAdd = categoryDiff
        .filter(info => info[0] === '+')
        .map(info => info[1]);

      await PostsCategories.removeCategoriesFromPost(id, categoriesToRemove);
      await PostsCategories.addCategoriesToPost(id, categoriesToAdd);
    } catch (e) {
      ctx.throw(e);
    }
  }

  try {
    await ctx.post.update(updateQuery);
    const post = await Post.readPostById(id);
    const serialized = serializePost(post);
    ctx.body = { ...serialized, series };
  } catch (e) {
    ctx.throw(500, e);
  }
  redisClient.remove(`/@${ctx.user.username}/${encodeURI(ctx.post.url_slug)}`);
};

export const readPost = async (ctx: Context): Promise<*> => {
  const { id } = ctx.params;
  try {
    const [post, seriesPost] = await Promise.all([
      Post.readPostById(id),
      SeriesPosts.findOne({
        include: [Series],
        where: {
          fk_post_id: id,
        },
      }),
    ]);

    const serialized = serializePost(post);
    ctx.body = {
      ...serialized,
      series: seriesPost
        ? {
          id: seriesPost.series.id,
          name: seriesPost.series.name,
        }
        : null,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const deletePost = async (ctx: Context): Promise<*> => {
  const { post } = ctx;
  try {
    // LATER ON: REMOVE COMMENTS
    await Promise.all([
      db
        .getQueryInterface()
        .bulkDelete('posts_categories', { fk_post_id: post.id }),
      db.getQueryInterface().bulkDelete('posts_tags', { fk_post_id: post.id }),
      db.getQueryInterface().bulkDelete('post_likes', { fk_post_id: post.id }),
    ]);
    const seriesPost = await SeriesPosts.findOne({
      where: {
        fk_post_id: post.id,
      },
    });
    if (seriesPost) {
      subtractIndexes(seriesPost.fk_series_id, seriesPost.index);
      seriesPost.destroy();
    }
    await post.destroy();
    redisClient.remove(`/@${ctx.user.username}/${ctx.post.url_slug}`);
    ctx.status = 204;
  } catch (e) {
    ctx.throw(500, e);
  }
};
