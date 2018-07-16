// @flow
import axios from 'lib/defaultClient';

export const getTempSaveList = (postId: string) => axios.get(`/posts/${postId}/saves`);

export type LoadTempSavePayload = {
  postId: string,
  saveId: string,
};

export const loadTempSave = ({ postId, saveId }: LoadTempSavePayload) => {
  return axios.get(`/posts/${postId}/saves/${saveId}`);
};
