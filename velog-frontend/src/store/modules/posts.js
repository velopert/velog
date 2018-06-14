// @flow
import { createAction, handleActions, type ActionType } from 'redux-actions';
import produce from 'immer';
import * as PostsAPI from 'lib/api/posts';
import * as CommentsAPI from 'lib/api/posts/comments';
import { applyPenders, type ResponseAction } from 'lib/common';

export type TocItem = {
  anchor: string,
  level: number,
  text: string,
};

/* ACTION TYPE */
const READ_POST = 'posts/READ_POST';
const SET_TOC = 'posts/SET_TOC';
const ACTIVATE_HEADING = 'posts/ACTIVATE_HEADING';
const WRITE_COMMENT = 'posts/WRITE_COMMENT';

export interface PostsActionCreators {
  readPost(payload: PostsAPI.ReadPostPayload): any;
  setToc(payload: ?(TocItem[])): any;
  activateHeading(payload: string): any;
  writeComment(payload: CommentsAPI.WriteCommentPayload): any;
}

export const actionCreators = {
  readPost: createAction(READ_POST, PostsAPI.readPost),
  setToc: createAction(SET_TOC, (toc: ?(TocItem[])) => toc),
  activateHeading: createAction(ACTIVATE_HEADING, (headingId: string) => headingId),
  writeComment: createAction(WRITE_COMMENT, CommentsAPI.writeComment),
};

type SetTocAction = ActionType<typeof actionCreators.setToc>;
type ActivateHeadingAction = ActionType<typeof actionCreators.activateHeading>;

export type Categories = { id: string, name: string, url_slug: string }[];

export type PostData = {
  id: string,
  title: string,
  body: string,
  thumbnail: ?string,
  is_markdown: boolean,
  created_at: string,
  updated_at: string,
  tags: string[],
  categories: Categories,
  url_slug: string,
  likes: number,
  comments_count: 0,
  user: {
    username: string,
    id: string,
  },
};

export type Posts = {
  post: ?PostData,
  toc: ?(TocItem[]),
  activeHeading: ?string,
};

const initialState: Posts = {
  post: null,
  toc: null,
  activeHeading: null,
};

const reducer = handleActions(
  {
    [SET_TOC]: (state, action: SetTocAction) => {
      return produce(state, (draft) => {
        draft.toc = action.payload;
      });
    },
    [ACTIVATE_HEADING]: (state, action: ActivateHeadingAction) => {
      return produce(state, (draft) => {
        draft.activeHeading = action.payload;
      });
    },
  },
  initialState,
);

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
  {
    type: WRITE_COMMENT,
    onSuccess: (state: Posts, action: ResponseAction) => {
      console.log(action);
      return state;
    },
  },
]);
