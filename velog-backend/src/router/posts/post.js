// @flow
import Router from 'koa-router';
import needsAuth from 'lib/middlewares/needsAuth';

import * as postCtrl from './post.ctrl';

const post: Router = new Router();

post.get('/', postCtrl.readPost);
post.patch('/', postCtrl.checkPostOwnership, postCtrl.readPost);
post.delete('/', postCtrl.checkPostOwnership, postCtrl.deletePost);
post.post('/like', needsAuth, postCtrl.likePost);
post.delete('/like', needsAuth, postCtrl.unlikePost);

export default post;
