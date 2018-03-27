// @flow
import Router from 'koa-router';
import { checkUUID } from 'lib/common';
import * as followCtrl from './follow.ctrl';

const follow: Router = new Router();

follow.get('/', checkUUID, followCtrl.getFollows); // get all follow info (tags / users)
follow.post('/users/:id'); // follow user
follow.post('/tags/:id'); // follow tag
follow.delete('/users/:id'); // unfollow user
follow.delete('/tags/:id'); // unfollow tag

export default follow;
