// @flow
import Router from 'koa-router';
import needsAuth from 'lib/middlewares/needsAuth';

import * as commentCtrl from './comment.ctrl';

const comment: Router = new Router();

comment.post('/', needsAuth, commentCtrl.writeComment);

export default comment;
