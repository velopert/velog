// @flow
import Router from 'koa-router';
import type { Context } from 'koa';
import needsAuth from 'lib/middlewares/needsAuth';
import auth from './auth';
import posts from './posts';
import files from './files';
import me from './me';
import feeds from './feeds';

const router: Router = new Router();

router.use('/auth', auth.routes());
router.use('/posts', posts.routes());
router.use('/me', needsAuth, me.routes());
router.use('/files', files.routes());
router.use('/feeds', feeds.routes());
router.get('/check', (ctx: Context) => {
  ctx.body = {
    version: '1.0.0-alpha.0',
  };
});

export default router;
