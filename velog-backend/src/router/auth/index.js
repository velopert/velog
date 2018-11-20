// @flow
import Router from 'koa-router';

import * as authCtrl from './auth.ctrl';
import callback from './callback';

const auth: Router = new Router();

auth.post('/send-auth-email', authCtrl.sendAuthEmail);
auth.get('/code/:code', authCtrl.getCode);
auth.post('/code-login', authCtrl.codeLogin);
auth.post('/register/local', authCtrl.createLocalAccount);
// auth.post('/login/local', authCtrl.localLogin);
auth.get('/check', authCtrl.check);
auth.post('/logout', authCtrl.logout);
auth.post(
  '/verify-social/:provider(github|facebook|google)',
  authCtrl.verifySocial,
);
auth.post(
  '/register/:provider(github|facebook|google)',
  authCtrl.socialRegister,
);
auth.post('/login/:provider(github|facebook|google)', authCtrl.socialLogin);
auth.use('/callback', callback.routes());
auth.post('/certify', authCtrl.certifyEmail);

export default auth;
