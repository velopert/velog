import render from './render.js';
import { Context } from 'koa';
import redisClient from '../lib/redisClient';
import { check } from './rules';

const manifest = require('../../asset-manifest.json');

function buildHtml(rendered, state, helmet) {
  const escaped = JSON.stringify(state).replace(/</g, '\\u003c');

  const html = `<!DOCTYPE html>
<html lang="en">

<head>
  <!-- Global site tag (gtag.js) - Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=UA-125599395-1"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'UA-125599395-1');
  </script>
  <meta name="google-site-verification" content="KtqT08pVRqPjexLMOeNd0A7g7KQ-MdTOWBDPCjQol10" />
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
  <meta name="theme-color" content="#000000">
  <link rel="manifest" href="https://cdn.velog.io/manifest.json">
  <link rel="shortcut icon" href="https://cdn.velog.io/favicon.ico">
  <link rel="apple-touch-icon" sizes="152x152" href="https://cdn.velog.io/favicons/apple-icon-152x152.png">
  <link rel="apple-touch-icon" sizes="180x180" href="https://cdn.velog.io/favicons/apple-icon-180x180.png">
  <link rel="icon" type="image/png" sizes="192x192" href="https://cdn.velog.io/favicons/android-icon-192x192.png">
  <link rel="icon" type="image/png" sizes="32x32" href="https://cdn.velog.io/favicons/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="96x96" href="https://cdn.velog.io/favicons/favicon-96x96.png">
  <link rel="icon" type="image/png" sizes="16x16" href="https://cdn.velog.io/favicons/favicon-16x16.png">
  ${
    helmet
      ? `
    ${helmet.title.toString()}
    ${helmet.meta.toString()}
    ${helmet.link.toString()}
  `
      : ''
  }
  <link href="${manifest['main.css']}" rel="stylesheet">
</head>

<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root">
    ${rendered}
  </div>
  ${
    state
      ? `<script>
    window.__REDUX_STATE__ = ${escaped}
  </script>`
      : ''
  }
  <script type="text/javascript" src="${manifest['main.js']}"></script>
</body>

</html>
  `;
  return html;
}

export const indexHtml = buildHtml('', null, null);

const ssr = async (ctx: Context) => {
  const token = ctx.cookies.get('access_token');
  try {
    // check cache
    if (!token) {
      const cache = await redisClient.getCache(ctx.url);
      if (cache && process.env.DISABLE_CACHE !== 'true') {
        ctx.set('Cache-Status', 'cached');
        ctx.body = cache;
        return;
      }
    }
    const { state, html, helmet, context } = await render(ctx);

    const link = helmet && helmet.link.toComponent();
    if (link && link.length > 0) {
      for (let i = 0; i < link.length; i += 1) {
        const { rel, href } = link[0].props;
        if (rel !== 'canonical') continue;
        const processedUrl = encodeURI(href.replace('https://velog.io', ''));
        if (rel === 'canonical' && processedUrl !== ctx.url) {
          ctx.redirect(processedUrl);
          return;
        }
      }
    }
    if (context.status) {
      ctx.status = context.status;
    }
    const body = buildHtml(html, state, helmet);
    ctx.body = body;
    if (token) return;
    const rule = check(ctx.path);
    if (rule) {
      await redisClient.setCache(ctx.url, body, rule.maxAge);
      ctx.set('Cache-Status', `cached_now (${rule.maxAge})`);
    }
  } catch (e) {
    console.log(e);
    if (e.response && e.response.status === 404) {
      ctx.status = 404;
      ctx.redirect('/404');
    }
    ctx.body = indexHtml;
  }
};

export default ssr;
