// @flow
import type { Middleware, Context } from 'koa';
import { getTagsList } from '../../database/rawQuery/tags';

export const getTags: Middleware = async (ctx) => {
  const { sort = 'posts_count' } = ctx.query;
  const availableSort = ['posts_count', 'name'];

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
