// @flow
import axios from 'lib/defaultClient';

export const getTags = (sort: string = 'popular') => {
  return axios.get(`/common/tags?sort=${sort}`);
};

export const getTagInfo = (tag: string) => {
  return axios.get(`/common/tags/${tag}`);
};
