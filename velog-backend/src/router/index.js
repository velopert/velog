// @flow
import Router from 'koa-router';
import type { Context } from 'koa';
import needsAuth from 'lib/middlewares/needsAuth';
import downloadImage from 'lib/downloadImage';
import crypto from 'crypto';
import { PostReadcounts } from 'database/views';
import auth from './auth';
import posts from './posts';
import files from './files';
import me from './me';
import feeds from './feeds';
import users from './users';
import common from './common';
import sitemaps from './sitemaps';
import Post from '../database/models/Post';
import { getTagsList } from '../database/rawQuery/tags';

const router: Router = new Router();

router.use('/auth', auth.routes());
router.use('/posts', posts.routes());
router.use('/me', needsAuth, me.routes());
router.use('/files', files.routes());
router.use('/feeds', feeds.routes());
router.use('/users', users.routes());
router.use('/common', common.routes());
router.use('/sitemaps', sitemaps.routes());

router.get('/check', (ctx: Context) => {
  console.log('avoiding cold start...');
  ctx.body = {
    version: '1.0.0-alpha.0',
    origin: ctx.origin,
    env: process.env.NODE_ENV,
  };
});

router.get('/test', async (ctx: Context) => {});

export default router;
