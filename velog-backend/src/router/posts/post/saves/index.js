// @flow
import Router from 'koa-router';
import needsAuth from 'lib/middlewares/needsAuth';

import * as savesCtrl from './saves.ctrl';

const saves: Router = new Router();

saves.get('/', savesCtrl.getTempSaveList);
saves.get('/:saveId', savesCtrl.loadTempSave);
saves.post('/', savesCtrl.tempSave);

export default saves;
