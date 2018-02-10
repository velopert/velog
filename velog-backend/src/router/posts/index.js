// @flow
import Router from 'koa-router';
import needsAuth from 'lib/middlewares/needsAuth';

import * as postsCtrl from './posts.ctrl';

const posts: Router = new Router();

posts.post('/', needsAuth, postsCtrl.writePost);
posts.get('/@:username/:urlSlug', postsCtrl.readPost);
posts.get('/@:username', postsCtrl.listPosts);
posts.get('/public', postsCtrl.listPosts);

export default posts;
