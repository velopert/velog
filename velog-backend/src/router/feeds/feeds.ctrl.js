// @flow
import type { Middleware, Context } from 'koa';
import Feed from 'database/models/Feed';
import pick from 'lodash/pick';
import { isUUID } from '../../lib/common';

export const listFeeds: Middleware = async (ctx: Context) => {
  const { cursor } = ctx.query;

  if (cursor && !isUUID(cursor)) {
    ctx.body = {
      type: 'INVALID_CURSOR_ID',
    };
    ctx.status = 400;
    return;
  }

  try {
    const feeds = await Feed.findFeedsOf({
      userId: ctx.user.id,
      cursor,
    });
    if (!feeds) {
      ctx.body = [];
      return;
    }
    const serialize = feed => pick(feed, ['id', 'reason', 'created_at', 'post']);
    const serialized = feeds.map(serialize);
    ctx.body = serialized;
  } catch (e) {
    if (e.name === 'CURSOR_NOT_FOUND') {
      ctx.status = 404;
      ctx.body = {
        type: 'CURSOR_NOT_FOUND',
      };
      return;
    }
    ctx.throw(e);
  }
};
