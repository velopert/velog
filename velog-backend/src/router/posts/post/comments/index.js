// @flow
import Router from 'koa-router';
import needsAuth from 'lib/middlewares/needsAuth';

import * as commentsCtrl from './comments.ctrl';

const comments: Router = new Router();

comments.get('/', commentsCtrl.getCommentList);
comments.get('/:commentId/replies', commentsCtrl.getReplies);
comments.post('/', needsAuth, commentsCtrl.writeComment);

const comment = new Router();
comment.delete('/', commentsCtrl.deleteComment);
comment.patch('/', commentsCtrl.editComment);

comments.use(
  '/:commentId',
  needsAuth,
  commentsCtrl.checkOwnComment,
  comment.routes(),
);

export default comments;
