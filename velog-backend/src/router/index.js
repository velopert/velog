// @flow
import Router from 'koa-router';
import type { Context } from 'koa';
import needsAuth from 'lib/middlewares/needsAuth';
import downloadImage from 'lib/downloadImage';
import crypto from 'crypto';

import auth from './auth';
import posts from './posts';
import files from './files';
import me from './me';
import feeds from './feeds';
import users from './users';

const router: Router = new Router();

router.use('/auth', auth.routes());
router.use('/posts', posts.routes());
router.use('/me', needsAuth, me.routes());
router.use('/files', files.routes());
router.use('/feeds', feeds.routes());
router.use('/users', users.routes());

router.get('/check', (ctx: Context) => {
  if (typeof process.env.HASH_KEY !== 'string') return;
  const hash = crypto
    .createHmac('sha256', process.env.HASH_KEY)
    .update(ctx.request.ip)
    .digest('hex');

  ctx.body = {
    version: '1.0.0-alpha.0',
    ip: ctx.request.ip,
    ipHash: hash,
  };
});

router.get('/test', async (ctx: Context) => {
  ctx.body = await downloadImage('https://velopert.com/wp-content/uploads/2018/04/prettier.png');
});

export default router;
