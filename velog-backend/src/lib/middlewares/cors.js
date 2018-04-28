// @flow

import type { Context } from 'koa';

export default (ctx: Context, next: () => Promise<*>) => {
  ctx.set('Access-Control-Allow-Origin', 'https://velog.io');
  ctx.set('Access-Control-Allow-Credentials', (true: any));
  return next();
};
