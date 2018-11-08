import Router from 'koa-router';
import * as atomCtrl from './atom.ctrl';

const rss = new Router();

rss.get('/', atomCtrl.getEntireRSS);
rss.get('/@:username', atomCtrl.getUserRSS);

export default rss;
