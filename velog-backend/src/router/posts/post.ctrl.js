// @flow
import type { Context } from 'koa';
import { Post, PostLike } from 'database/models';
import { serializePost } from 'database/models/Post';
import db from 'database/db';
import Joi from 'joi';
import { validateSchema, generateSlugId, escapeForUrl } from 'lib/common';


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
    urlSlug: string,
    thumbnail: string,
    isTemp: boolean,
  }

  const schema = Joi.object().keys({
    title: Joi.string().min(1).max(120),
    body: Joi.string().min(1),
    thumbnail: Joi.string(),
    isTemp: Joi.boolean(),
    categories: Joi.array().items(Joi.string()),
    tags: Joi.array().items(Joi.string()),
    urlSlug: Joi.string().max(130),
  });

  if (!validateSchema(ctx, schema)) {
    return;
  }

  const {
    title, body, tags,
    categories, urlSlug, thumbnail, isTemp,
  }: BodySchema = (ctx.request.body: any);

  const generatedUrlSlug = `title ${generateSlugId()}`;
  const escapedUrlSlug = escapeForUrl(urlSlug || generatedUrlSlug);


  const { id } = ctx.params;

  const urlSlugShouldChange = title && (ctx.post.title !== title);
  console.log(ctx.post.title, title);
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

  console.log(updateQuery);

  try {
    await ctx.post.update(updateQuery);
    const post = await Post.readPostById(id);
    const serialized = serializePost(post);
    ctx.body = serialized;
  } catch (e) {
    ctx.throw(500, e);
  }
  // TODO: current !== received -> check urlSlugExistancy
  // TODO: tags / categories edit logic
  // TODO: URL SLUG CHANGE NOT WORKING
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

export const likePost = async (ctx: Context): Promise<*> => {
  const { id } = ctx.params;
  const { id: userId } = ctx.user;

  try {
    const exists = await PostLike.checkExists({
      userId,
      postId: id,
    });

    if (exists) {
      ctx.status = 409;
      ctx.body = { name: 'ALREADY_LIKED' };
      return;
    }

    await PostLike.build({
      fk_user_id: userId,
      fk_post_id: id,
    }).save();
    // TODO: increment like_sum
    const { post } = ctx;
    await post.like();
    ctx.body = {
      likes: post.likes,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const unlikePost = async (ctx: Context): Promise<*> => {
  const { id } = ctx.params;
  const { id: userId } = ctx.user;

  try {
    const exists = await PostLike.checkExists({
      userId,
      postId: id,
    });

    if (!exists) {
      ctx.status = 409;
      ctx.body = { name: 'NOT_LIKED' };
      return;
    }

    await exists.destroy();
    // TODO: increment like_sum
    const { post } = ctx;
    await post.unlike();
    ctx.body = {
      likes: post.likes,
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
