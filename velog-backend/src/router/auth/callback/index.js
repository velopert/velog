// @flow
import Router from 'koa-router';
import * as callbackCtrl from './callback.ctrl';

const callback = new Router();

callback.get('/github', callbackCtrl.githubCallback);

export default callback;
