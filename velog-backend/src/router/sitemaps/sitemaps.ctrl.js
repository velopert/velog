// @flow
import type { Middleware } from 'koa';
import subMonths from 'date-fns/sub_months';
import format from 'date-fns/format';
import { getPostsOfMonth } from 'database/rawQuery/posts';

const generateMonths = () => {
  let date = new Date();
  const months = [];

  while (format(date, 'YYYY-MM') !== '2018-08') {
    months.push(format(date, 'YYYY-MM'));
    date = subMonths(date, 1);
  }

  return months;
};

type Link = {
  location: string,
  lastmod?: string,
  changefreq?: string,
  priority?: number,
};

function generateSitemap(links: Link[]): string {
  const urls = links.map(link => `<url>
  <loc>${link.location}</loc>
  ${link.lastmod ? `<lastmod>${link.lastmod}</lastmod>` : ''}
  ${link.changefreq ? `<changefreq>${link.changefreq}</changefreq>` : ''}
  ${link.priority ? `<priority>${link.priority.toFixed(1)}</priority>` : ''}
</url>`);

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.join('')}
</urlset>`;
}

export const sitemapIndex: Middleware = (ctx) => {
  const urls = ['https://velog.io/sitemaps/general.xml'];
  urls.push(...generateMonths().map(month => `https://velog.io/sitemaps/posts-${month}.xml`));
  const indexes = urls.map(url => ({ location: url }));

  ctx.set('Content-Type', 'text/xml');
  ctx.body = `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${indexes
    .map(index => `<sitemap><loc>${index.location}</loc></sitemap>`)
    .join('')}
  </sitemapindex>`;
};

export const generalSitemap: Middleware = (ctx) => {
  ctx.set('Content-Type', 'text/xml');
  const links: Link[] = [
    {
      location: 'https://velog.io/',
    },
    {
      location: 'https://velog.io/trending',
      changefreq: 'daily',
      priority: 1,
    },
    {
      location: 'https://velog.io/recent',
      changefreq: 'always',
      priority: 1,
    },
    {
      location: 'https://velog.io/tags',
      changefreq: 'daily',
      priority: 0.8,
    },
  ];
  ctx.body = generateSitemap(links);
};

export const postsSitemap: Middleware = async (ctx) => {
  ctx.set('Content-Type', 'text/xml');
  try {
    const data = await getPostsOfMonth(ctx.params.month);
    const links: Link[] = data.map(r => ({
      location: `https://velog.io/@${r.username}/${encodeURI(r.url_slug)}`,
      lastmod: format(r.updated_at, 'YYYY-MM-DDThh:mmZ'),
      priority: 0.5,
      changefreq: 'weekly',
    }));
    ctx.body = generateSitemap(links);
  } catch (e) {
    ctx.throw(500, e);
  }
};
