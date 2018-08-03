// const loaded = require('./render.js');
import render from './render.js';
import { Context } from 'koa';
import { minify } from 'html-minifier';

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
    <link rel="manifest" href="https://cdn.velog.io/manifest.json">
    <link rel="shortcut icon" href="https://cdn.velog.io/favicon.ico">
    ${helmet.title.toString()}
    ${helmet.meta.toString()}
    ${helmet.link.toString()}
    <link href="${manifest['main.css']}" rel="stylesheet">
  </head>
  
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root">
      ${rendered}
    </div>
    <script>
      window.__REDUX_STATE__ = ${escaped}
    </script>
    <script type="text/javascript" src="${manifest['main.js']}"></script>
  </body>
  
  </html>
  `;
  return minify(html, {
    collapseWhitespace: true,
    collapseInlineTagWhitespace: true,
  });
}

const ssr = async (ctx: Context) => {
  try {
    const { state, html, helmet } = await render(ctx);
    ctx.body = buildHtml(html, state, helmet);
  } catch (e) {
    console.log(e);
  }
}

export default ssr;