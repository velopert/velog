// @flow
import Router from 'koa-router';
import needsAuth from 'lib/middlewares/needsAuth';

import * as postsCtrl from './posts.ctrl';

const posts: Router = new Router();

posts.post('/', needsAuth, postsCtrl.writePost);

export default posts;
