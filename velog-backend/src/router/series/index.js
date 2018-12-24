// @flow
import Router from 'koa-router';
import needsAuth from 'lib/middlewares/needsAuth';
import { checkUUID } from 'lib/common';
import * as seriesCtrl from './series.ctrl';

const series: Router = new Router();

series.post('/', needsAuth, seriesCtrl.createSeries);
series.get('/', seriesCtrl.listSeries);
series.get('/:username', seriesCtrl.listSeries);
series.get('/:username/:urlSlug', seriesCtrl.getSeries);
series.patch('/:seriesId', seriesCtrl.updateSeries);

export default series;
