import * as Router from 'koa-router';
import { Context } from 'koa';

const router = new Router();

router.get('/', (ctx: Context) => {
  ctx.body = 'I am alive!';
});

export default router;
