// @flow
import Router from 'koa-router';
import needsAuth from 'lib/middlewares/needsAuth';

import * as feedsCtrl from './feeds.ctrl';

const feeds: Router = new Router();

feeds.get('/', needsAuth, feedsCtrl.listFeeds);

export default feeds;
