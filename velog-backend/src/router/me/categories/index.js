// @flow
import Router from 'koa-router';
import { checkUUID } from 'lib/common';
import * as categoriesCtrl from './categories.ctrl';

const categories: Router = new Router();
categories.get('/', categoriesCtrl.listCategories);
categories.post('/', categoriesCtrl.createCategory);
categories.put('/reorder', categoriesCtrl.reorderCategories);
categories.patch('/:id', checkUUID, categoriesCtrl.renameCategory);
categories.delete('/:id', checkUUID, categoriesCtrl.deleteCategory);


export default categories;
