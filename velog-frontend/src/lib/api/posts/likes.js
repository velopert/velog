// @flow
import axios from 'lib/defaultClient';

export const like = (postId: string) => axios.post(`/posts/${postId}/likes`);

export const unlike = (postId: string) => axios.delete(`/posts/${postId}/likes`);

export const getLikesCount = (postId: string) => axios.get(`/posts/${postId}/likes`);
