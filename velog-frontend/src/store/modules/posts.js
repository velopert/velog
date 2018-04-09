// @flow
import { createAction, handleActions, type ActionType } from 'redux-actions';
import produce from 'immer';
import * as PostsAPI from 'lib/api/posts';
import { applyPenders, type ResponseAction } from 'lib/common';

/* ACTION TYPE */
const READ_POST = 'posts/READ_POST';

export interface PostsActionCreators {
  readPost(payload: PostsAPI.ReadPostPayload): any,
}

export const actionCreators = {
  readPost: createAction(READ_POST, PostsAPI.readPost),
};

export type PostData = {
  id: string,
  title: string,
  body: string,
  thumbnail: ?string,
  is_markdown: boolean,
  created_at: string,
  updated_at: string,
  tags: string[],
  categories: { id: string, name: string }[],
  url_slug: string,
  likes: number,
  comments_count: 0
}


export type Posts = {
  post: ?PostData
}

const initialState: Posts = {
  post: null,
};

const reducer = handleActions({}, initialState);

export default applyPenders(reducer, [
  {
    type: READ_POST,
    onSuccess: (state: Posts, action: ResponseAction) => {
      return produce(state, (draft) => {
        if (!action.payload) return;
        draft.post = action.payload.data;
      });
    },
  },
]);