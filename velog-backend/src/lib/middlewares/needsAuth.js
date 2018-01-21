// @flow
import type { Context } from 'koa';

// returns 401 error if not authorized
export default (ctx: Context, next: () => Promise<*>) => {
  if (!ctx.user) {
    ctx.status = 401;
    return;
  }
  return next();
};
