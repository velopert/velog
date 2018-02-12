// @flow

import type { Context } from 'koa';
import Joi from 'joi';
import { validateSchema, filterUnique } from 'lib/common';
import { Category, Post, PostsCategories, PostsTags, Tag, User, UserProfile } from 'database/models';
import shortid from 'shortid';
import { type PostModel } from 'database/models/Post';
import Sequelize from 'sequelize';

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
    title: Joi.string().required().min(1).max(120),
    body: Joi.string().required().min(1),
    shortDescription: Joi.string(),
    thumbnail: Joi.string(),
    isMarkdown: Joi.boolean().required(),
    isTemp: Joi.boolean().required(),
    meta: Joi.object(),
    categories: Joi.array().items(Joi.string()).required(),
    tags: Joi.array().items(Joi.string()).required(),
    urlSlug: Joi.string().max(130),
  });

  if (!validateSchema(ctx, schema)) {
    return;
  }

  const {
    title, body, shortDescription, thumbnail,
    isMarkdown, isTemp, meta, categories, tags, urlSlug,
  }: BodySchema = (ctx.request.body: any);

  const generatedUrlSlug = `${title}-${shortid.generate()}`;
  const escapedUrlSlug = (urlSlug || generatedUrlSlug).replace(/ /g, '-');
  const replaceDashToSpace = text => text.replace(/-/g, ' ');
  // TODO: validate url slug

  const uniqueTags: Array<string> = filterUnique(tags).map(replaceDashToSpace);
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
      meta_json: JSON.stringify(meta),
      url_slug: escapedUrlSlug,
    }).save();

    const postId = post.id;
    await PostsTags.link(postId, tagIds);
    await PostsCategories.link(postId, uniqueCategories);

    const categoriesInfo = await PostsCategories.findCategoriesByPostId(postId);

    ctx.body = {
      ...post.toJSON(),
      tags: uniqueTags,
      categories: categoriesInfo.map(({ id, name }) => ({ id, name }))
        .filter(({ id }) => id),
    };
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
    const serialize = (data) => {
      const {
        id, title, body, thumbnail, is_markdown, created_at, updated_at, url_slug,
      } = data;
      const tags = data.tags.map(tag => tag.name);
      const categories = data.categories.map(category => category.name);
      return {
        id, title, body, thumbnail, is_markdown,
        created_at, updated_at, tags, categories, url_slug,
      };
    };
    ctx.body = serialize(post);
  } catch (e) {
    ctx.throw(500, e);
  }
};

const serialize = (data) => {
  const {
    id, title, body, thumbnail, is_markdown, created_at, updated_at, url_slug,
  } = data;
  const tags = data.tags.map(t => t.name);
  const categories = data.categories.map(c => c.name);
  return {
    id, title, body: body.slice(0, 250), thumbnail, is_markdown,
    created_at, updated_at, tags, categories, url_slug,
  };
};

export const listPosts = async (ctx: Context): Promise<*> => {
  const { username } = ctx.params;
  const { category, tag, page } = ctx.query;

  const query = { username, categorySlug: category, tag };

  try {
    const data = await Post.listPosts(query);
    ctx.body = data.map(serialize);
  } catch (e) {
    ctx.throw(500, e);
  }
};
/*
export const listPosts = async (ctx: Context): Promise<*> => {
  const { username } = ctx.params;
  const { category, tag, page } = ctx.query;

  const serialize = (data) => {
    const {
      id, title, body, thumbnail, is_markdown, created_at, updated_at, url_slug,
    } = data;
    const tags = data.tags.map(t => t.name);
    const categories = data.categories.map(c => c.name);
    return {
      id, title, body: body.slice(0, 250), thumbnail, is_markdown,
      created_at, updated_at, tags, categories, url_slug,
    };
  };

  const query = { username, categorySlug: category, tag };
  try {
    const posts = await Post.listPosts({
      ...query,
      page,
    });
    const postCount = posts.count;
    const pageLimit = Math.ceil(postCount / 10);


    console.log(postCount);

    ctx.set('Page-Limit', (pageLimit || 1).toString());
    ctx.set('Post-Count', (postCount).toString());
    ctx.body = posts.rows.map(serialize);
  } catch (e) {
    ctx.throw(500, e);
  }
};
*/
