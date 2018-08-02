import * as Router from 'koa-router';
import { Context } from 'koa';

const router = new Router();

router.get('/ping', (ctx: Context) => {
  ctx.body = 'pong';
});

export default router;
