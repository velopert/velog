// @flow
import Router from 'koa-router';

import * as authCtrl from './auth.ctrl';

const auth:Router = new Router();

auth.post('/send-auth-email', authCtrl.sendAuthEmail);
auth.get('/code/:code', authCtrl.getCode);
auth.post('/code-login', authCtrl.codeLogin);
auth.post('/register/local', authCtrl.createLocalAccount);
// auth.post('/login/local', authCtrl.localLogin);
auth.get('/check', authCtrl.check);

export default auth;
