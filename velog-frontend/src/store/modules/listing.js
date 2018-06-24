// @flow
import { createAction, handleActions, type ActionType } from 'redux-actions';
import produce from 'immer';
import { applyPenders } from 'redux-pender';
import * as PostsAPI from 'lib/api/posts';

const GET_RECENT_POSTS = 'listing/GET_RECENT_POSTS';
const PREFETCH_RECENT_POSTS = 'listing/PREFETCH';
const REVEAL_PREFETCHED = 'listing/REVEAL_PREFETCHED';
const CLEAR_USER_POSTS = 'listing/CLEAR_USER_POSTS';
const GET_USER_POSTS = 'listing/GET_USER_POSTS';
const PREFETCH_USER_POSTS = 'listing/PREFETCH_USER_POSTS';

export const actionCreators = {
  getRecentPosts: createAction(GET_RECENT_POSTS, PostsAPI.getPublicPosts),
  prefetchRecentPosts: createAction(PREFETCH_RECENT_POSTS, PostsAPI.getPublicPosts),
  revealPrefetched: createAction(REVEAL_PREFETCHED, (type: string) => type),
  clearUserPosts: createAction(CLEAR_USER_POSTS),
  getUserPosts: createAction(GET_USER_POSTS, PostsAPI.getUserPosts),
  prefetchUserPosts: createAction(PREFETCH_USER_POSTS, PostsAPI.getUserPosts),
};

export type PostItem = {
  id: string,
  title: string,
  body: string,
  thumbnail: ?string,
  is_markdown: boolean,
  created_at: string,
  updated_at: string,
  tags: string[],
  categories: any[],
  url_slug: string,
  likes: number,
  user: {
    id: string,
    username: string,
    display_name: string,
    short_bio: string,
    thumbnail: ?string,
  },
};

export type Listing = {
  recentEnd: boolean,
  recentPosts: ?(PostItem[]),
  prefetchedRecentPosts: ?(PostItem[]),
  userPosts: ?(PostItem[]),
  prefetchedUserPosts: ?(PostItem[]),
  userEnd: boolean,
};

type RevealPrefetchedAction = ActionType<typeof actionCreators.revealPrefetched>;
type PostsResponseAction = {
  type: string,
  payload: {
    data: PostItem[],
  },
};

export interface ListingActionCreators {
  getRecentPosts(): any;
  prefetchRecentPosts(cursor: string): any;
  revealPrefetched(type: string): any;
  getUserPosts(payload: PostsAPI.GetUserPostsPayload): any;
  prefetchUserPosts(payload: PostsAPI.GetUserPostsPayload): any;
}

// TODO: refactoring
/* like
  recent: {
    end: false,
    posts: null,
    prefetched: null,
  },
*/
const initialState: Listing = {
  recentEnd: false,
  recentPosts: null,
  prefetchedRecentPosts: null,
  userPosts: null,
  prefetchedUserPosts: null,
  userEnd: false,
};

const reducer = handleActions(
  {
    [REVEAL_PREFETCHED]: (state, action: RevealPrefetchedAction) => {
      return produce(state, (draft) => {
        if (!action) return;
        if (action.payload === 'recent' && state.recentPosts && state.prefetchedRecentPosts) {
          draft.recentPosts = state.recentPosts.concat(state.prefetchedRecentPosts);
          draft.prefetchedRecentPosts = null;
        }
        if (action.payload === 'user' && state.prefetchedUserPosts && state.userPosts) {
          draft.userPosts = state.userPosts.concat(state.prefetchedUserPosts);
          draft.prefetchedUserPosts = null;
        }
      });
    },
    [CLEAR_USER_POSTS]: (state) => {
      return {
        ...state,
        userPosts: null,
      };
    },
  },
  initialState,
);

export default applyPenders(reducer, [
  {
    type: GET_RECENT_POSTS,
    onSuccess: (state: Listing, action: PostsResponseAction) => {
      return produce(state, (draft) => {
        draft.recentEnd = false;
        draft.recentPosts = action.payload.data;
        draft.prefetchedRecentPosts = null;
      });
    },
  },
  {
    type: PREFETCH_RECENT_POSTS,
    onSuccess: (state: Listing, action: PostsResponseAction) => {
      return produce(state, (draft) => {
        draft.prefetchedRecentPosts = action.payload.data;
        if (action.payload.data && action.payload.data.length === 0) {
          draft.recentEnd = true;
        }
      });
    },
  },
  {
    type: GET_USER_POSTS,
    onPending: (state: Listing) => {
      return {
        ...state,
        userEnd: false,
        prefetchedUserPosts: null,
      };
    },
    onSuccess: (state: Listing, action: PostsResponseAction) => {
      return {
        ...state,
        userPosts: action.payload.data,
      };
    },
  },
  {
    type: PREFETCH_USER_POSTS,
    onSuccess: (state: Listing, action: PostsResponseAction) => {
      return {
        ...state,
        prefetchedUserPosts: action.payload.data,
      };
    },
  },
]);
