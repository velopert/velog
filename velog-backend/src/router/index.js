// @flow
import Router from 'koa-router';
import type { Context } from 'koa';
import needsAuth from 'lib/middlewares/needsAuth';
import axios from 'axios';
import auth from './auth';
import posts from './posts';
import files from './files';
import me from './me';
import feeds from './feeds';
import users from './users';
import common from './common';
import sitemaps from './sitemaps';
import internal from './internal';
import atom from './atom';
import search from './search';
import series from './series';

const router: Router = new Router();

router.use('/auth', auth.routes());
router.use('/posts', posts.routes());
router.use('/me', needsAuth, me.routes());
router.use('/files', files.routes());
router.use('/feeds', feeds.routes());
router.use('/users', users.routes());
router.use('/common', common.routes());
router.use('/sitemaps', sitemaps.routes());
router.use('/internal', internal.routes());
router.use('/atom', atom.routes());
router.use('/search', search.routes());
router.use('/series', series.routes());

router.get('/check', (ctx: Context) => {
  console.log('avoiding cold start...');
  ctx.body = {
    version: '1.0.0',
    origin: ctx.origin,
    env: process.env.NODE_ENV,
  };
});

router.get('/test', async (ctx: Context) => {
  const response = await axios.head('https://images.velog.io/images/velopert/profile/6b651f80-052c-11e9-82df-fde20d373f7d/IMG20180302210116.jpg');
  console.log(response);
});

export default router;
