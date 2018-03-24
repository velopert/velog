import axios, { type Axios } from 'axios';

const defaultClient: Axios = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '/' : 'https://api.velog.io',
});

export default defaultClient;