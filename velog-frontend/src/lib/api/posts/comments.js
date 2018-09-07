// @flow
import axios from 'lib/defaultClient';

export type WriteCommentPayload = {
  postId: string,
  text: string,
  replyTo?: ?string,
};

export const writeComment = ({ postId, text, replyTo }: WriteCommentPayload) =>
  axios.post(`/posts/${postId}/comments`, {
    text,
    reply_to: replyTo,
  });

export type ReadCommentsPayload = {
  postId: string,
};

export const readComments = ({ postId }: ReadCommentsPayload) =>
  axios.get(`/posts/${postId}/comments`);

export type ReadSubcommentsPayload = {
  postId: string,
  commentId: string,
  parentId?: ?string,
};

export const readSubcomments = ({ postId, commentId }: ReadSubcommentsPayload) =>
  axios.get(`/posts/${postId}/comments/${commentId}/replies`);

export type RemoveCommentPayload = {
  postId: string,
  commentId: string,
};

export const removeComment = ({ postId, commentId }: RemoveCommentPayload) => {
  return axios.delete(`/posts/${postId}/comments/${commentId}`);
};

export type EditCommentPayload = {
  postId: string,
  commentId: string,
  text: string,
  parentId: ?string,
};

export const editComment = ({ postId, commentId, text }: EditCommentPayload) =>
  axios.patch(`/posts/${postId}/comments/${commentId}`, { text });
