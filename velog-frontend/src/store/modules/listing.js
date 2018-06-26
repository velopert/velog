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

export type ListingSet = {
  posts: ?(PostItem[]),
  prefetched: ?(PostItem[]),
  end: boolean,
};

export type Listing = {
  recent: ListingSet,
  user: ListingSet,
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

const initialState: Listing = {
  recent: {
    posts: null,
    prefetched: null,
    end: false,
  },
  user: {
    posts: null,
    prefetched: null,
    end: false,
  },
};

const reducer = handleActions(
  {
    [REVEAL_PREFETCHED]: (state, action: RevealPrefetchedAction) => {
      return produce(state, (draft) => {
        const { payload } = action;
        const { posts, prefetched } = draft[payload];
        if (posts && prefetched) {
          posts.push(...prefetched);
          draft[payload].prefetched = null;
        }
      });
    },
    [CLEAR_USER_POSTS]: (state) => {
      return produce(state, (draft) => {
        draft.user.posts = null;
      });
    },
  },
  initialState,
);

export default applyPenders(reducer, [
  {
    type: GET_RECENT_POSTS,
    onSuccess: (state: Listing, action: PostsResponseAction) => {
      return produce(state, (draft) => {
        draft.recent = {
          end: false,
          posts: action.payload.data,
          prefetched: null,
        };
      });
    },
  },
  {
    type: PREFETCH_RECENT_POSTS,
    onSuccess: (state: Listing, action: PostsResponseAction) => {
      const { data } = action.payload;
      return produce(state, (draft) => {
        draft.recent.prefetched = data;
        if (data && data.length === 0) {
          draft.recent.end = true;
        }
      });
    },
  },
  {
    type: GET_USER_POSTS,
    onPending: (state: Listing) => {
      return produce(state, (draft) => {
        draft.user.end = false;
        draft.user.prefetched = null;
      });
    },
    onSuccess: (state: Listing, action: PostsResponseAction) => {
      return produce(state, (draft) => {
        draft.user.posts = action.payload.data;
      });
    },
  },
  {
    type: PREFETCH_USER_POSTS,
    onSuccess: (state: Listing, action: PostsResponseAction) => {
      const { data } = action.payload;
      return produce(state, (draft) => {
        draft.user.prefetched = data;
        if (data && data.length === 0) {
          draft.user.end = true;
        }
      });
    },
  },
]);
