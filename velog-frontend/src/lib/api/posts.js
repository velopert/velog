// @flow
import axios from 'axios';

export type WritePostPayload = {
  title: string,
  body: string,
  isMarkdown: boolean,
  isTemp: boolean,
  tags: Array<string>,
  categories: Array<string>
}

export const writePost = (payload: WritePostPayload) => axios.post('/posts', payload);