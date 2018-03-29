// @flow
import Router from 'koa-router';
import * as meCtrl from './me.ctrl';
import categories from './categories';
import follow from './follow';

const me: Router = new Router();
me.use('/categories', categories.routes());
me.use('/follow', follow.routes());

export default me;
