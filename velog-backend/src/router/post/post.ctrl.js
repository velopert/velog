// @flow

import type { Context } from 'koa';
import Joi from 'joi';
import { validateSchema } from 'lib/common';
import { Category, Post, PostsCategories, PostsTags, Tag, User, UserProfile } from 'database/models';

import { type PostModel } from 'database/models/Post';

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
    tags: Array<string>
  };

  const schema = Joi.object().keys({
    title: Joi.string().required().min(1).max(120),
    body: Joi.string().required().min(1),
    shortDescription: Joi.string(),
    thumbnail: Joi.string(),
    isMarkdown: Joi.boolean().required(),
    isTemp: Joi.boolean().required(),
    meta: Joi.any(),
    categories: Joi.array().items(Joi.string()),
    tags: Joi.array().items(Joi.string()),
  });

  if (!validateSchema(ctx, schema)) {
    return;
  }

  const {
    title, body, shortDescription, thumbnail,
    isMarkdown, isTemp, meta, categories, tags,
  }: BodySchema = (ctx.request.body: any);

  console.log(ctx.request.body);

  try {
    // create Post data
    const post = await Post.build({
      title,
      body,
      short_description: shortDescription,
      thumbnail,
      is_markdown: isMarkdown,
      is_temp: isTemp,
      fk_user_id: ctx.user.id,
    }).save();
    ctx.body = post.toJSON();
  } catch (e) {
    ctx.throw(500, e);
  }
};
