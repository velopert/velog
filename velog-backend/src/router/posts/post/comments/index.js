// @flow
import Router from 'koa-router';
import needsAuth from 'lib/middlewares/needsAuth';

import * as commentsCtrl from './comments.ctrl';

const comment: Router = new Router();

comment.get('/', commentsCtrl.getCommentList);
comment.get('/:commentId/replies', commentsCtrl.getReplies);
comment.delete('/:commentId', needsAuth, commentsCtrl.deleteReply);
comment.post('/', needsAuth, commentsCtrl.writeComment);

export default comment;
