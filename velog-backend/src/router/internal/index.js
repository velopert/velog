// @flow
import Router from 'koa-router';
import redisClient from 'lib/redisClient';

const internal = new Router();

internal.get('/flush', async (ctx) => {
  const { INTERNAL_KEY } = process.env;
  console.log(ctx.query.key, INTERNAL_KEY);
  if (ctx.query.key !== INTERNAL_KEY) {
    ctx.status = 403;
    return;
  }
  try {
    await redisClient.flushall();
    ctx.status = 204;
  } catch (e) {
    ctx.throw(500, e);
  }
});

export default internal;
