// @flow
import Router from 'koa-router';

import * as authCtrl from './auth.ctrl';

const auth:Router = new Router();

auth.post('/register/local', authCtrl.createLocalAccount);

export default auth;
