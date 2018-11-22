// @flow
import Router from 'koa-router';
import * as commonCtrl from './common.ctrl';

const common = new Router();
common.get('/tags/:tag', commonCtrl.getTagInfo);
common.get('/tags', commonCtrl.getTags);
common.get('/email/unsubscribe', commonCtrl.unsubscribeEmail);

export default common;
