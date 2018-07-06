// @flow
import axios from 'lib/defaultClient';

export const getTags = (sort: string = 'posts_count') => {
  return axios.get(`/common/tags?sort=${sort}`);
};
