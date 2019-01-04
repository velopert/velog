// @flow
import axios from 'lib/defaultClient';
import queryString from 'query-string';

export type WritePostPayload = {
  title: string,
  body: string,
  is_temp: boolean,
  tags: Array<string>,
  categories: Array<string>,
  thumbnail: ?string,
  url_slug?: ?string,
  is_private: boolean,
  series_id: ?string,
};

export const writePost = (payload: WritePostPayload) => axios.post('/posts', payload);

export type UpdatePostPayload = {
  id: string,
  title: string,
  body: string,
  tags: Array<string>,
  categories: Array<string>,
  url_slug?: ?string,
  thumbnail?: string,
  is_temp: boolean,
  thumbnail: ?string,
  is_private: boolean,
  series_id: ?string,
};

export const updatePost = ({ id, ...payload }: UpdatePostPayload) =>
  axios.patch(`/posts/${id}`, payload);

export type ReadPostPayload = {
  username: string,
  urlSlug: string,
};

export const readPost = ({ username, urlSlug }: ReadPostPayload) =>
  axios.get(`/posts/@${username}/${urlSlug}`);

export type UploadImagePayload = {
  file: any,
  postId: string,
  onUploadProgress(): void,
};

export const uploadImage = ({ file, postId, onUploadProgress }: UploadImagePayload) => {
  const data = new FormData();
  data.append('post_id', postId);
  data.append('image', file);
  return axios.post('/files/upload', data, {
    onUploadProgress,
  });
};

export type TempSavePayload = {
  title: string,
  body: string,
  postId: string,
};

export const tempSave = ({ postId, title, body }: TempSavePayload) =>
  axios.post(`/posts/${postId}/saves`, { title, body });

export type CreateUploadUrlPayload = { postId: string, filename: string };
export const createUploadUrl = ({ postId, filename }: CreateUploadUrlPayload) => {
  return axios.post('/files/create-url/post-image', { post_id: postId, filename });
};

/* LISTING RELATED... */
export const getPublicPosts = (cursor: ?string) => {
  const query = cursor ? `?cursor=${cursor}` : '';
  return axios.get(`/posts/public${query}`);
};

export const getTrendingPosts = (offset: ?number) => {
  const query = offset ? `?offset=${offset}` : '';
  return axios.get(`/posts/trending${query}`);
};

export type GetUserPostsPayload = {
  username: string,
  tag?: string,
  cursor?: string,
};

export const getUserPosts = ({ username, cursor, tag }: GetUserPostsPayload) => {
  const query = queryString.stringify({
    cursor,
    tag,
  });
  return axios.get(`/posts/@${username}?${query}`);
};

export type GetPublicPostsByTagPayload = {
  tag: string,
  cursor?: string,
};

export const getPublicPostsByTag = (payload: GetPublicPostsByTagPayload) => {
  const query = queryString.stringify(payload);
  return axios.get(`/posts/public?${query}`);
};

export type GetTempPostsPayload = {
  username: string,
  cursor?: string,
};

export const getTempPosts = ({ username, cursor }: GetTempPostsPayload) => {
  const query = queryString.stringify({
    is_temp: true,
    cursor,
  });
  return axios.get(`/posts/@${username}?${query}`);
};

export const deletePost = (postId: string) => {
  return axios.delete(`/posts/${postId}`);
};

export const getPostById = (postId: string) => {
  return axios.get(`/posts/${postId}`);
};

export const getPostSequences = (postId: string) => {
  return axios.get(`/posts/sequences?post_id=${postId}`);
};
