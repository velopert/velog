// @flow
import Router from 'koa-router';
import { checkUUID } from 'lib/common';
import * as followCtrl from './follow.ctrl';

const follow: Router = new Router();

follow.get('/', checkUUID, followCtrl.getFollows); // get all follow info (tags / users)
follow.get('/users/:id', checkUUID, followCtrl.getFollowUserStatus);
follow.post('/users/:id', checkUUID, followCtrl.followUser); // follow user
follow.delete('/users/:id', checkUUID, followCtrl.unfollowUser); // unfollow user
follow.get('/tags/:id', checkUUID, followCtrl.getFollowTagStatus); // follow tag
follow.post('/tags/:id', checkUUID, followCtrl.followTag); // follow tag
follow.delete('/tags/:id', checkUUID); // unfollow tag

export default follow;
