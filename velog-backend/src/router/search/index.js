// @flow
import Router from 'koa-router';
import { publicSearch } from './search.ctrl';

const search = new Router();

search.get('/', publicSearch);

export default search;
