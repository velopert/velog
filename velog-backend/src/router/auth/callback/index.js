// @flow
import Router from 'koa-router';
import * as callbackCtrl from './callback.ctrl';

const callback = new Router();

callback.get('/github', callbackCtrl.githubCallback);
callback.get('/google', callbackCtrl.googleCallback);
callback.get('/token', callbackCtrl.getToken);
callback.get('/google/login', callbackCtrl.redirectGoogleLogin);

export default callback;
