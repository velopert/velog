// @flow
import type { Context } from 'koa';
import { decode } from 'lib/token';

export default async (ctx: Context, next: () => Promise<*>) => {
  const token: string | void = ctx.cookies.get('access_token');

  if (!token) {
    ctx.user = null;
    return next();
  }

  try {
    const decoded: any = await decode(token);
    const { user, exp } = decoded;

    ctx.user = user;
    ctx.tokenExpire = new Date(exp * 1000);
  } catch (e) {
    ctx.user = null;
  }

  return next();
};
