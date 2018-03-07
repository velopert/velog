// @flow
import Router from 'koa-router';
import needsAuth from 'lib/middlewares/needsAuth';

import * as postCtrl from './post.ctrl';
import comment from './comment';
import like from './like';

const post: Router = new Router();

post.get('/', postCtrl.readPost);
post.patch('/', needsAuth, postCtrl.checkPostOwnership, postCtrl.updatePost);
post.delete('/', needsAuth, postCtrl.checkPostOwnership, postCtrl.deletePost);
post.use('/comment', comment.routes());
post.use('/like', like.routes());

export default post;
