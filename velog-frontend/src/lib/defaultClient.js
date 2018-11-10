// @flow

import axios, { type Axios } from 'axios';

axios.defaults.withCredentials = true;

const baseURL = (() => {
  if (process.env.NODE_ENV === 'development') return '/';
  if (process.env.APP_ENV === 'server' && process.env.LOCAL === 'true') {
    return 'http://localhost:4000/';
  }
  return 'https://api.velog.io';
})();

const defaultClient: Axios = axios.create({
  baseURL,
  withCredentials: true,
});

if (process.env.APP_ENV === 'server') {
  defaultClient.defaults.timeout = 3000;
}

export default defaultClient;
