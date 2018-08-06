// @flow

import type { Context } from 'koa';

export default (ctx: Context, next: () => Promise<*>) => {
  ctx.set('Access-Control-Allow-Origin', 'https://velog.io');
  if (ctx.headers.referer && ctx.headers.referer.indexOf('localhost:5000') > -1) {
    ctx.set('Access-Control-Allow-Origin', 'http://localhost:5000');
  }
  ctx.set('Access-Control-Allow-Credentials', (true: any));
  return next();
};
