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
me.patch('/email', meCtrl.changeEmail);
me.post('/resend-certmail', meCtrl.resendCertmail);
me.patch('/email-permissions', meCtrl.updateEmailPermissions);
me.patch('/profile-links', meCtrl.updateProfileLinks);
me.patch('/about', meCtrl.updateAbout);
export default me;
