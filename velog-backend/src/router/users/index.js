// @flow
import Router from 'koa-router';
import * as usersCtrl from './users.ctrl';

const users = new Router();
const user = new Router();

user.get('/', usersCtrl.getProfile);
user.get('/tags', usersCtrl.getTags);
user.get('/history', usersCtrl.getHistory);
users.use('/@:username', usersCtrl.getUser, user.routes());

export default users;
