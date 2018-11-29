// @flow
import type { Middleware, Context } from 'koa';
import Tag from 'database/models/Tag';
import Post from 'database/models/Post';
import UserMeta from 'database/models/UserMeta';
import { generate, decode } from 'lib/token';
import { generateUnsubscribeToken, getHost } from 'lib/common';

import {
  getTagsList,
  getPostsCountByTagId,
} from '../../database/rawQuery/tags';

export const getTags: Middleware = async (ctx) => {
  const { sort = 'popular' } = ctx.query;
  const availableSort = ['popular', 'name'];

  if (availableSort.indexOf(sort) === -1) {
    ctx.body = {
      name: 'INVALID_SORT',
    };
    ctx.status = 400;
    return;
  }

  try {
    if (availableSort.indexOf(sort) === -1) return;
    const tags = await getTagsList(sort);
    ctx.body = [...tags];
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const getTagInfo: Middleware = async (ctx) => {
  const { tag } = ctx.params;
  try {
    const tagData = await Tag.findByName(tag);
    const count = await getPostsCountByTagId(tagData.id);
    ctx.body = {
      name: tagData.name,
      posts_count: count,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const unsubscribeEmail: Middleware = async (ctx) => {
  const { token } = ctx.query;
  const host = getHost();
  if (!token) {
    ctx.redirect(`${host}/error`);
    return;
  }
  try {
    const decoded = await decode(token);
    const { user_id, meta_field } = decoded;
    const userMeta = await UserMeta.findOne({
      where: {
        fk_user_id: user_id,
      },
    });
    userMeta[meta_field] = false;
    await userMeta.save();
    ctx.redirect(`${host}success?type=unsubscribe_email`);
  } catch (e) {
    ctx.redirect(`${host}error`);
  }
};
