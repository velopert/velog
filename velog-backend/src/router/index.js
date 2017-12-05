// @flow
import Router from 'koa-router';

const router: Router = new Router();

router.get('/bye', (ctx) => {
  ctx.body = 'good bye';
});

export default router;
