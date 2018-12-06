// @flow
import Router from 'koa-router';
import { publicSearch } from './search.ctrl';

const search = new Router();

search.get('/public', publicSearch);
export default search;
