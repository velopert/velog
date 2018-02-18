// @flow
import Router from 'koa-router';
import needsAuth from 'lib/middlewares/needsAuth';

import * as postCtrl from './post.ctrl';

const post: Router = new Router();

post.get('/', postCtrl.readPost);
post.patch('/', postCtrl.readPost);
post.delete('/', postCtrl.readPost);
post.post('/like', needsAuth, postCtrl.likePost);

export default post;
