import axios, { type Axios } from 'axios';

axios.defaults.withCredentials = true;

const defaultClient: Axios = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '/' : 'https://api.velog.io',
  withCredentials: true,
});

export default defaultClient;
