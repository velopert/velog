// @flow
import { createAction, handleActions, type ActionType } from 'redux-actions';
import produce from 'immer';
import * as PostsAPI from 'lib/api/posts';
import * as CommentsAPI from 'lib/api/posts/comments';
import * as LikesAPI from 'lib/api/posts/like';
import { applyPenders, type ResponseAction } from 'lib/common';

export type TocItem = {
  anchor: string,
  level: number,
  text: string,
};

/* ACTION TYPE */
const READ_POST = 'posts/READ_POST';
const UNLOAD_POST = 'posts/UNLOAD_POST';
const SET_TOC = 'posts/SET_TOC';
const ACTIVATE_HEADING = 'posts/ACTIVATE_HEADING';
const WRITE_COMMENT = 'posts/WRITE_COMMENT';
const READ_COMMENTS = 'posts/READ_COMMENTS';
const READ_SUBCOMMENTS = 'posts/READ_SUBCOMMENTS';
const LIKE = 'posts/LIKE';
const UNLIKE = 'posts/UNLIKE';
const GET_LIKES_COUNT = 'posts/GET_LIKES_COUNT';
const TOGGLE_ASK_REMOVE = 'posts/TOGGLE_ASK_REMOVE';
const OPEN_COMMENT_REMOVE = 'posts/OPEN_COMMENT_REMOVE';
const CANCEL_COMMENT_REMOVE = 'posts/CANCEL_COMMENT_REMOVE';
const REMOVE_COMMENT = 'posts/REMOVE_COMMENT';
const EDIT_COMMENT = 'posts/EDIT_COMMENT';
const GET_SEQUENCES = 'posts/GET_SEQUENCES';

type OpenCommentRemovePayload = { commentId: string, parentId: ?string };

export interface PostsActionCreators {
  readPost(payload: PostsAPI.ReadPostPayload): any;
  unloadPost(): any;
  setToc(payload: ?(TocItem[])): any;
  activateHeading(payload: string): any;
  writeComment(payload: CommentsAPI.WriteCommentPayload): any;
  readComments(payload: CommentsAPI.ReadCommentsPayload): any;
  readSubcomments(payload: CommentsAPI.ReadSubcommentsPayload): any;
  like(postId: string): any;
  unlike(postId: string): any;
  getLikesCount(postId: string): any;
  toggleAskRemove(): any;
  openCommentRemove(payload: OpenCommentRemovePayload): any;
  cancelCommentRemove(): any;
  removeComment(payload: CommentsAPI.RemoveCommentPayload): any;
  editComment(payload: CommentsAPI.EditCommentPayload): any;
  getSequences(postId: string): any;
}

export const actionCreators = {
  readPost: createAction(READ_POST, PostsAPI.readPost),
  unloadPost: createAction(UNLOAD_POST),
  setToc: createAction(SET_TOC, (toc: ?(TocItem[])) => toc),
  activateHeading: createAction(ACTIVATE_HEADING, (headingId: string) => headingId),
  writeComment: createAction(WRITE_COMMENT, CommentsAPI.writeComment),
  readComments: createAction(READ_COMMENTS, CommentsAPI.readComments),
  readSubcomments: createAction(READ_SUBCOMMENTS, CommentsAPI.readSubcomments, meta => meta),
  like: createAction(LIKE, LikesAPI.like),
  unlike: createAction(UNLIKE, LikesAPI.unlike),
  getLikesCount: createAction(GET_LIKES_COUNT, LikesAPI.getLikesCount),
  toggleAskRemove: createAction(TOGGLE_ASK_REMOVE),
  openCommentRemove: createAction(
    OPEN_COMMENT_REMOVE,
    (payload: OpenCommentRemovePayload) => payload,
  ),
  cancelCommentRemove: createAction(CANCEL_COMMENT_REMOVE),
  removeComment: createAction(REMOVE_COMMENT, CommentsAPI.removeComment),
  editComment: createAction(EDIT_COMMENT, CommentsAPI.editComment, payload => payload),
  getSequences: createAction(GET_SEQUENCES, PostsAPI.getPostSequences),
};

type SetTocAction = ActionType<typeof actionCreators.setToc>;
type ActivateHeadingAction = ActionType<typeof actionCreators.activateHeading>;
type OpenCommentRemoveAction = ActionType<typeof actionCreators.openCommentRemove>;
export type Categories = { id: string, name: string, url_slug: string }[];
export type Comment = {
  id: string,
  text: ?string,
  reply_to: string,
  level: number,
  created_at: string,
  updated_at: string,
  user: {
    username: ?string,
    thumbnail: ?string,
  },
  replies_count: number,
};
export type PostData = {
  id: string,
  title: string,
  body: string,
  thumbnail: ?string,
  is_markdown: boolean,
  is_private: boolean,
  released_at: string,
  created_at: string,
  updated_at: string,
  tags: string[],
  categories: Categories,
  url_slug: string,
  likes: number,
  liked: boolean,
  comments_count: 0,
  user: {
    username: string,
    id: string,
    thumbnail: ?string,
    short_bio: ?string,
  },
  meta: {
    code_theme: string,
    short_description: ?string,
  },
  series: ?{
    description: string,
    id: string,
    index: number,
    length: number,
    url_slug: string,
    thumbnail: ?string,
    name: string,
    list: { index: number, id: string, title: string, url_slug: string }[],
  },
};

export type SubcommentsMap = {
  [string]: Comment[],
};

export type RemoveComment = {
  visible: boolean,
  commentId: ?string,
  parentId: ?string,
};

export type PostSequence = {
  id: string,
  title: string,
  body: string,
  meta: ?{
    code_theme: string,
    short_description: string,
  },
  url_slug: string,
  created_at: string,
  released_at: string,
};

export type Posts = {
  post: ?PostData,
  toc: ?(TocItem[]),
  activeHeading: ?string,
  comments: ?(Comment[]),
  sequences: ?(PostSequence[]),
  subcommentsMap: SubcommentsMap,
  askRemove: boolean,
  removeComment: RemoveComment,
};

const initialState: Posts = {
  post: null,
  toc: null,
  activeHeading: null,
  comments: null,
  sequences: [],
  subcommentsMap: {},
  askRemove: false,
  removeComment: {
    commentId: null,
    parentId: null,
    visible: false,
  },
};

const reducer = handleActions(
  {
    [UNLOAD_POST]: (state, action) => {
      return initialState;
    },
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
    [TOGGLE_ASK_REMOVE]: (state) => {
      return {
        ...state,
        askRemove: !state.askRemove,
      };
    },
    [OPEN_COMMENT_REMOVE]: (state, { payload }: OpenCommentRemoveAction) => {
      return {
        ...state,
        removeComment: {
          ...payload,
          visible: true,
        },
      };
    },
    [CANCEL_COMMENT_REMOVE]: (state) => {
      return {
        ...state,
        removeComment: initialState.removeComment,
      };
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
      return produce(state, (draft) => {
        if (draft.comments) {
          // draft.comments.push(action.payload.data);
          return;
        }
        draft.comments = [action.payload.data];
      });
    },
  },
  {
    type: READ_COMMENTS,
    onSuccess: (state: Posts, action: ResponseAction) => {
      return {
        ...state,
        comments: action.payload.data,
      };
    },
  },
  {
    type: READ_SUBCOMMENTS,
    onSuccess: (state: Posts, action: ResponseAction) => {
      return produce(state, (draft) => {
        const { parentId, commentId } = action.meta;
        // is root comment
        if (!draft.comments) return;
        let comment = null;
        if (!parentId) {
          comment = draft.comments.find(c => c.id === commentId);
        } else {
          if (!draft.subcommentsMap[parentId]) return;
          comment = draft.subcommentsMap[parentId].find(c => c.id === commentId);
        }
        if (!comment) return;
        comment.replies_count = action.payload.data.length;
        draft.subcommentsMap[action.meta.commentId] = action.payload.data;
      });
    },
  },
  {
    type: LIKE,
    onPending: (state: Posts) => {
      return produce(state, (draft) => {
        if (draft.post) {
          draft.post.likes += 1;
          draft.post.liked = true;
        }
      });
    },
    onSuccess: (state: Posts, action: ResponseAction) => {
      return produce(state, (draft) => {
        if (draft.post) {
          draft.post.likes = action.payload.data && action.payload.data.likes;
          draft.post.liked = true;
        }
      });
    },
    onFailure: (state: Posts) => {
      return produce(state, (draft) => {
        if (draft.post) {
          draft.post.likes -= 1;
          draft.post.liked = false;
        }
      });
    },
  },
  {
    type: UNLIKE,
    onPending: (state: Posts) => {
      return produce(state, (draft) => {
        if (draft.post) {
          draft.post.likes -= 1;
          draft.post.liked = false;
        }
      });
    },
    onSuccess: (state: Posts, action: ResponseAction) => {
      return produce(state, (draft) => {
        if (draft.post) {
          draft.post.likes = action.payload.data && action.payload.data.likes;
          draft.post.liked = false;
        }
      });
    },
    onFailure: (state: Posts) => {
      return produce(state, (draft) => {
        if (draft.post) {
          draft.post.likes += 1;
          draft.post.liked = true;
        }
      });
    },
  },
  {
    type: REMOVE_COMMENT,
    onPending: (state: Posts) => {
      return produce(state, (draft) => {
        draft.removeComment.visible = false;
      });
    },
    onSuccess: (state: Posts) => {
      const { commentId, parentId } = state.removeComment;
      return produce(state, (draft) => {
        const target = (() => {
          const { subcommentsMap, comments } = draft;
          // Case 1. it is subcomment
          if (parentId) {
            const subcomments = subcommentsMap[parentId];
            if (!subcomments) return null;
            const comment = subcomments.find(c => c.id === commentId);
            return comment;
          }
          // Case 2. it is normal comment
          if (!comments) return null;
          const comment = comments.find(c => c.id === commentId);
          return comment;
        })();

        if (!target) return; // ensure target is found
        target.text = null;
        target.user.username = null;
        target.user.thumbnail = null;
      });
    },
  },
  {
    type: EDIT_COMMENT,
    onSuccess: (state: Posts, action: ResponseAction) => {
      const { payload, meta } = action;
      const { commentId, parentId } = meta;
      return produce(state, (draft) => {
        const { subcommentsMap, comments } = draft;
        // is subcomment
        if (parentId) {
          const subcomments = subcommentsMap[parentId];
          if (!subcomments) return;
          const index = subcomments.findIndex(c => c.id === commentId);
          subcomments[index] = payload.data;
          return;
        }
        // is root comment
        if (!comments) return;
        const index = comments.findIndex(c => c.id === commentId);
        comments[index] = payload.data;
      });
    },
  },
  {
    type: GET_SEQUENCES,
    onSuccess: (state: Posts, action: ResponseAction) => {
      return {
        ...state,
        sequences: action.payload.data,
      };
    },
  },
]);
