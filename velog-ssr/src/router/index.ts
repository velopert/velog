import * as Router from 'koa-router';
import { Context } from 'koa';
import { indexHtml } from '../ssr/index';
import axios from 'axios';
import redisClient from '../lib/redisClient';

const router = new Router();

let serviceWorkerCache = null;

router.get('/check', ctx => {
  ctx.body = {
    version: '1.0.0-alpha.0',
    redis_connected_time: redisClient.connectedTime,
  };
});

router.get('/ping', async (ctx: Context) => {
  try {
    const cache = await redisClient.getCache('hello');
    ctx.body = cache;
    await redisClient.setCache('hello', 'world', 360);
  } catch (e) {
    console.log(e);
  }
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
});

router.get('/sitemaps/:filename', async ctx => {
  const { filename } = ctx.params;
  try {
    const response = await axios.get(
      `https://api.velog.io/sitemaps/${filename}`
    );
    ctx.set('Content-Type', 'text/xml');
    ctx.body = response.data;
  } catch (e) {
    ctx.throw(500, e);
  }
});

router.get('/robots.txt', ctx => {
  ctx.body = `User-agent: *
Allow: /

User-agent: Baiduspider
Disallow: /

Sitemap: https://velog.io/sitemaps/index.xml`;
});

export default router;
