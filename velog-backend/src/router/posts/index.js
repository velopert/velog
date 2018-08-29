// @flow
import Router from 'koa-router';
import needsAuth from 'lib/middlewares/needsAuth';
import { checkUUID } from 'lib/common';
import post from './post';

import * as postsCtrl from './posts.ctrl';
import { checkPostExistancy } from './post/post.ctrl';

const posts: Router = new Router();

posts.post('/', needsAuth, postsCtrl.writePost);
posts.get('/sequences', postsCtrl.listSequences);
posts.get('/@:username/:urlSlug', postsCtrl.readPost);
posts.get('/@:username', postsCtrl.listPosts);
posts.get('/public', postsCtrl.listPosts);
posts.get('/trending', postsCtrl.listTrendingPosts);
posts.use('/:id', checkUUID, checkPostExistancy, post.routes());

export default posts;
