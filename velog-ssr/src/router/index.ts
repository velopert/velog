import * as Router from 'koa-router';
import { Context } from 'koa';
import { indexHtml } from '../ssr/index';
import axios from 'axios';

const router = new Router();

let serviceWorkerCache = null;

router.get('/ping', (ctx: Context) => {
  ctx.body = 'pong';
});

router.get('/index.html', (ctx: Context) => {
  ctx.body = indexHtml;
});

router.get('/manifest.json', (ctx: Context) => {
  ctx.body = {
    short_name: 'velog',
    name: '벨로그',
    icons: [
      {
        src: 'favicon.ico',
        sizes: '64x64 32x32 24x24 16x16',
        type: 'image/x-icon',
      },
    ],
    start_url: 'https://velog.io/index.html',
    display: 'standalone',
    theme_color: '#000000',
    background_color: '#ffffff',
  };
});

router.get('/service-worker.js', async (ctx: Context) => {
  if (serviceWorkerCache) {
    ctx.body = serviceWorkerCache;
    return;
  }
  try {
    const response = await axios.get('https://cdn.velog.io/service-worker.js');
    serviceWorkerCache = response.data;
    ctx.set('Content-Type', 'application/javascript');
    ctx.body = serviceWorkerCache;
  } catch (e) {
    ctx.throw(500, e);
  }
})

export default router;
