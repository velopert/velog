// @flow
import Router from 'koa-router';
import * as meCtrl from './me.ctrl';
import categories from './categories';
import follow from './follow';

const me: Router = new Router();
me.use('/categories', categories.routes());
me.use('/follow', follow.routes());
me.patch('/profile', meCtrl.updateProfile);
me.get('/unregister-token', meCtrl.generateUnregisterToken);
me.post('/unregister', meCtrl.unregister);
me.get('/email-info', meCtrl.getEmailInfo);

export default me;
