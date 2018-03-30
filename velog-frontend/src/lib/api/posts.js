// @flow
import axios from 'lib/defaultClient';

export type WritePostPayload = {
  title: string,
  body: string,
  isMarkdown: boolean,
  isTemp: boolean,
  tags: Array<string>,
  categories: Array<string>
}

export const writePost = (payload: WritePostPayload) => axios.post('/posts', payload);

export type UpdatePostPayload = {
  id: string,
  title: string,
  body: string,
  tags: Array<string>,
  categories: Array<string>,
  url_slug?: string,
  thumbnail?: string,
  is_temp: boolean,
};

export const updatePost = ({ id, ...payload }: UpdatePostPayload) => axios.patch(
  `/posts/${id}`, payload,
);