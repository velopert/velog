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
