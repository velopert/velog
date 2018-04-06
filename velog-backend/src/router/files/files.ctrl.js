// @flow
import type { Middleware, Context } from 'koa';
import fs from 'fs';

export const upload: Middleware = async (ctx: Context) => {
  // console.log(ctx.request.body);
  const { image } = (ctx.request.body: any).files;
  const reader = fs.createReadStream(image.path);
};
