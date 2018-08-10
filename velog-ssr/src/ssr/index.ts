import render from './render.js';
import { Context } from 'koa';
import redisClient from '../lib/redisClient';
import { check } from './rules';

const manifest = require('../../asset-manifest.json');

function buildHtml(rendered, state, helmet) {
  
  const escaped = JSON.stringify(state).replace(/</g, '\\u003c');

  const html = `
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
    <meta name="theme-color" content="#000000">
    <link rel="manifest" href="https://velog.io/manifest.json">
    <link rel="shortcut icon" href="https://cdn.velog.io/favicon.ico">
    ${helmet ? `
      ${helmet.title.toString()}
      ${helmet.meta.toString()}
      ${helmet.link.toString()}
    ` : ''}
    <link href="${manifest['main.css']}" rel="stylesheet">
  </head>
  
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root">
      ${rendered}
    </div>
    ${state ? `<script>
      window.__REDUX_STATE__ = ${escaped}
    </script>` : ''}
    <script type="text/javascript" src="${manifest['main.js']}"></script>
  </body>
  
  </html>
  `;
  return html;
}

export const indexHtml = buildHtml('', null, null);

const ssr = async (ctx: Context) => {
  console.log(redisClient.connectedTime);
  try {
    // check cache
    const cache = await redisClient.getCache(ctx.url);
    if (cache) {
      ctx.body = cache;
      return;
    }
    const { state, html, helmet } = await render(ctx);
    const body = buildHtml(html, state, helmet);
    ctx.body = body;
    const rule = check(ctx.path);
    if (rule) {
      await redisClient.setCache(ctx.url, body, rule.maxAge); 
      ctx.set('SSR-Cache-Duration', rule.maxAge.toString());
    }
  } catch (e) {
    ctx.body = indexHtml;
  }
}

export default ssr;