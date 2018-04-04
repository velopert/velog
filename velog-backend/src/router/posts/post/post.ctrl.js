// @flow
import type { Context } from 'koa';
import { serializePost } from 'database/models/Post';
import db from 'database/db';
import Joi from 'joi';
import { validateSchema, generateSlugId, escapeForUrl, extractKeys } from 'lib/common';
import { diff } from 'json-diff';
import { Post, PostLike, PostsTags, PostsCategories, Category } from 'database/models';


export const checkPostExistancy = async (ctx: Context, next: () => Promise<*>): Promise<*> => {
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
  }

  const schema = Joi.object().keys({
    title: Joi.string().min(1).max(120),
    body: Joi.string().min(1),
    thumbnail: Joi.string(),
    is_temp: Joi.boolean(),
    categories: Joi.array().items(Joi.string()),
    tags: Joi.array().items(Joi.string()),
    url_slug: Joi.string().max(130),
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
  }: BodySchema = (ctx.request.body: any);

  const generatedUrlSlug = `${title} ${generateSlugId()}`;
  const escapedUrlSlug = escapeForUrl(urlSlug || generatedUrlSlug);


  const { id } = ctx.params;

  const urlSlugShouldChange = urlSlug !== ctx.post.url_slug
    || (title && (ctx.post.title !== title));

  // current !== received -> check urlSlugExistancy
  if (urlSlugShouldChange) {
    const exists = await Post.checkUrlSlugExistancy({
      userId: ctx.user.id,
      urlSlug: escapedUrlSlug,
    });
    if (exists > 1) {
      ctx.body = {
        name: 'URL_SLUG_EXISTS',
      };
      ctx.status = 409;
      return;
    }
  }

  const updateQuery = {
    title,
    body,
    url_slug: urlSlugShouldChange && escapedUrlSlug,
    thumbnail,
    is_temp: isTemp,
  };

  Object.keys(updateQuery).forEach((key) => {
    if (!updateQuery[key]) {
      delete updateQuery[key];
    }
  });

  // Update Tags
  if (tags) {
    // Check which tags to remove or add
    const currentTags = await ctx.post.getTagNames();
    const tagNames = currentTags.tags.map(tag => tag.name);
    const tagDiff = diff(tagNames.sort(), tags.sort()) || [];

    const tagsToRemove = tagDiff.filter(info => info[0] === '-').map(info => info[1]);
    const tagsToAdd = tagDiff.filter(info => info[0] === '+').map(info => info[1]);

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
      if (count !== categories.length) {
        ctx.status = 409;
        ctx.body = {
          name: 'NOT_OWN_CATEGORY',
        };
        return;
      }

      // check which categories to remove or add
      const currentCategories = await ctx.post.getCategoryIds();
      const categoryDiff = diff(currentCategories.sort(), categories.sort()) || [];
      const categoriesToRemove = categoryDiff.filter(info => info[0] === '-').map(info => info[1]);
      const categoriesToAdd = categoryDiff.filter(info => info[0] === '+').map(info => info[1]);

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
    ctx.body = serialized;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const readPost = async (ctx: Context): Promise<*> => {
  const { id } = ctx.params;
  try {
    const post = await Post.readPostById(id);
    const serialized = serializePost(post);
    ctx.body = serialized;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const deletePost = async (ctx: Context): Promise<*> => {
  const { post } = ctx;
  try {
    // LATER ON: REMOVE COMMENTS
    await Promise.all([
      db.getQueryInterface().bulkDelete('posts_categories', { fk_post_id: post.id }),
      db.getQueryInterface().bulkDelete('posts_tags', { fk_post_id: post.id }),
      db.getQueryInterface().bulkDelete('post_likes', { fk_post_id: post.id }),
    ]);
    await post.destroy();
    ctx.status = 204;
  } catch (e) {
    ctx.throw(500, e);
  }
};
