import * as pathToRegexp from 'path-to-regexp';

const rules = [
  {
    path: '/',
    maxAge: 60 * 60 * 12,
  },
  {
    path: '/recent',
    maxAge: 60 * 10,
  },
  {
    path: '/trending',
    maxAge: 60 * 5,
  },
  {
    path: '/tags/:tag',
    maxAge: 60 * 10,
  },
  {
    path: '/@:username',
    maxAge: 60 * 10,
  },
  {
    path: '/@:username/tags/:tag',
    maxAge: 60 * 10,
  },
  {
    path: '/@:username/history',
    maxAge: 60 * 60 * 3,
  },
  {
    path: '/@:username/:urlSlug',
    maxAge: 60 * 60 * 3,
  },
];

export function check(path) {
  return rules.find(r => pathToRegexp(r.path).exec(path) !== null);
}
