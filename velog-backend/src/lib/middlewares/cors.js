// @flow

import type { Context } from 'koa';

export default (ctx: Context, next: () => Promise<*>) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  return next();
};
