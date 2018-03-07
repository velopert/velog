// @flow
import Router from 'koa-router';
import needsAuth from 'lib/middlewares/needsAuth';

import * as likeCtrl from './like.ctrl';

const like: Router = new Router();

like.get('/', likeCtrl.getLike);
like.post('/', needsAuth, likeCtrl.likePost);
like.delete('/', needsAuth, likeCtrl.unlikePost);

export default like;
