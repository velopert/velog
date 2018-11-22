// @flow
import type { Middleware, Context } from 'koa';
import Tag from 'database/models/Tag';
import Post from 'database/models/Post';
import { generate, decode } from 'lib/token';
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

/* SAMPLE TOKEN
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMjcxNDM5OTAtZWU2My0xMWU4LWE0ZDAtNjNiZDc2ODBiOTRiIiwibWV0YV9maWVsZCI6ImVtYWlsX25vdGlmaWNhdGlvbiIsImlhdCI6MTU0Mjg5ODIwNSwiZXhwIjoxNTQzNTAzMDA1LCJpc3MiOiJ2ZWxvZy5pbyIsInN1YiI6InVuc3Vic2NyaWJlLWVtYWlsIn0.eRgZ0E-SCQy44kuJo9mb0f-UyQyyjs8oiNF9pVLxiIU
*/
export const unsubscribeEmail: Middleware = async (ctx) => {
  const { token } = ctx.query;
  if (!token) {
    ctx.redirect('https://velog.io/error');
    return;
  }
  try {
    const decoded = await decode(token);
    ctx.redirect('https://velog.io/success');
  } catch (e) {
    ctx.redirect('https://velog.io/error');
  }
};
