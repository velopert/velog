// @flow
import Router from 'koa-router';
import * as sitemapsCtrl from './sitemaps.ctrl';

const sitemaps: Router = new Router();

sitemaps.get('/index.xml', sitemapsCtrl.sitemapIndex);
sitemaps.get('/general.xml', sitemapsCtrl.generalSitemap);
sitemaps.get('/posts-:month.xml', sitemapsCtrl.postsSitemap);

export default sitemaps;
