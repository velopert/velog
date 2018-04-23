// @flow
import type { Middleware, Context } from 'koa';
import Feed from 'database/models/Feed';

export const listFeeds: Middleware = async (ctx: Context) => {
  try {
    const feeds = await Feed.findFeedsOf({
      userId: ctx.user.id,
    });
    ctx.body = feeds;
  } catch (e) {
    ctx.throw(e);
  }
};
