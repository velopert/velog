// @flow
import type { Context } from 'koa';
import Post, { serializePost } from 'database/models/Post';
import { searchPosts, countSearchPosts } from 'database/rawQuery/search';
import { formatShortDescription } from 'lib/common';
import User from 'database/models/User';

export const publicSearch = async (ctx: Context) => {
  const { q, username, page } = ctx.query;
  const transformed = `${q.replace(/ /, '|')}:*`;
  const parsedPage = parseInt(page || 1, 10);
  if (!q || isNaN(parsedPage)) {
    ctx.status = 400;
    return;
  }
  try {
    const user =
      username &&
      (await User.findOne({
        where: {
          username,
        },
      }));
    const fk_user_id = null || (user && user.id);
    const authorized = !!(
      fk_user_id && (ctx.user && ctx.user.id) === fk_user_id
    );
    const [count, searchResult] = await Promise.all([
      countSearchPosts({
        tsquery: transformed,
        fk_user_id,
        authorized,
      }),
      searchPosts({
        tsquery: transformed,
        fk_user_id,
        authorized,
        page: parsedPage,
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
