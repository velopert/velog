// @flow
import Router from 'koa-router';
import * as categoriesCtrl from './categories.ctrl';

const categories: Router = new Router();
categories.get('/', categoriesCtrl.listCategories);

export default categories;
