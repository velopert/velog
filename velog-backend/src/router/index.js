// @flow
import Router from 'koa-router';
import type { Context } from 'koa';
import needsAuth from 'lib/middlewares/needsAuth';
import downloadImage from 'lib/downloadImage';
import crypto from 'crypto';
import { PostReadcounts } from 'database/views';
import { getTrendingPosts, getTrendingPostScore } from 'database/rawQuery/trending';
import auth from './auth';
import posts from './posts';
import files from './files';
import me from './me';
import feeds from './feeds';
import users from './users';
import Post from '../database/models/Post';

const router: Router = new Router();

router.use('/auth', auth.routes());
router.use('/posts', posts.routes());
router.use('/me', needsAuth, me.routes());
router.use('/files', files.routes());
router.use('/feeds', feeds.routes());
router.use('/users', users.routes());

router.get('/check', (ctx: Context) => {
  ctx.body = {
    version: '1.0.0-alpha.0',
  };
});

router.get('/test', async (ctx: Context) => {
  const data = await getTrendingPosts({
    id: '128281a0-6f36-11e8-9009-6f50dbed49aa',
    score: 5,
  });
  const fullposts = await Post.readPostsByIds(data.map(r => r.post_id));
  // const data = await getTrendingPostScore('128281a0-6f36-11e8-9009-6f50dbed49aa');
  ctx.body = fullposts;
});

export default router;
