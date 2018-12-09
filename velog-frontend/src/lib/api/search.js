// @flow
import axios from 'lib/defaultClient';
import qs from 'query-string';

export type SearchParams = {
  q: string,
  username?: string,
  page?: number,
};

export const search = ({ q, username, page }: SearchParams) => {
  const query = qs.stringify({ q, username, page });
  return axios.get(`/search?${query}`);
};
