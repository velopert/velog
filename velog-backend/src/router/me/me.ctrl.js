// @flow
import type { Context } from 'koa';

export const hello = async (ctx: Context): Promise<*> => {
  ctx.body = 'hello';
};
