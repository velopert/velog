// @flow
import type { Context } from 'koa';
import Post, { serializePost } from 'database/models/Post';
import { searchPosts, countSearchPosts } from 'database/rawQuery/search';
import { formatShortDescription } from 'lib/common';

export const publicSearch = async (ctx: Context) => {
  const { q } = ctx.query;
  const transformed = `${q.replace(/ /, '|')}:*`;
  try {
    const [count, searchResult] = await Promise.all([
      countSearchPosts({
        tsquery: transformed,
      }),
      searchPosts({
        tsquery: transformed,
      }),
    ]);

    const postIds = searchResult.map(r => r.id);
    const posts = await Post.readPostsByIds(postIds);
    const data = posts
      .map(serializePost)
      .map(post => ({ ...post, body: formatShortDescription(post.body) }));
    ctx.body = {
      count,
      data,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};
