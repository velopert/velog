// const loaded = require('./render.js');
import render from './render.js';
import { Context } from 'koa';

const ssr = async (ctx: Context) => {
  try {
    const result = await render(ctx);
    ctx.body = result;
  } catch (e) {
    console.log(e);
  }
}

export default ssr;