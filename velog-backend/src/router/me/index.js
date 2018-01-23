// @flow
import Router from 'koa-router';
import * as meCtrl from './me.ctrl';
import categories from './categories';

const me: Router = new Router();
me.use('/categories', categories.routes());

export default me;
