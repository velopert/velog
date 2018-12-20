// @flow
import axios from 'lib/defaultClient';

export const getTags = (sort: string = 'popular') => {
  return axios.get(`/common/tags?sort=${sort}`);
};

export const getTagInfo = (tag: string) => {
  return axios.get(`/common/tags/${tag}`);
};

export type CreateGeneralUploadUrlPayload = { refId?: string, filename: string, type: string };

export const createGeneralUploadUrl = ({
  refId,
  type,
  filename,
}: CreateGeneralUploadUrlPayload) => {
  return axios.post('/files/create-url/general', { ref_id: refId, filename, type });
};
