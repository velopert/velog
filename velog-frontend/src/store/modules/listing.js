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
const GET_TRENDING_POSTS = 'listing/GET_TRENDING_POSTS';
const PREFETCH_TRENDING_POSTS = 'listing/PREFETCH_TRENDING_POSTS';
const GET_TAG_POSTS = 'listing/GET_TAG_POSTS';
const PREFETCH_TAG_POSTS = 'listing/PREFETCH_TAG_POSTS';
const CLEAR_TAG_POSTS = 'listing/CLEAR_TAG_POSTS';

// potential improvement :: remove duplicates
export const actionCreators = {
  getRecentPosts: createAction(GET_RECENT_POSTS, PostsAPI.getPublicPosts),
  prefetchRecentPosts: createAction(PREFETCH_RECENT_POSTS, PostsAPI.getPublicPosts),
  revealPrefetched: createAction(REVEAL_PREFETCHED, (type: string) => type),
  clearUserPosts: createAction(CLEAR_USER_POSTS),
  getUserPosts: createAction(GET_USER_POSTS, PostsAPI.getUserPosts),
  prefetchUserPosts: createAction(PREFETCH_USER_POSTS, PostsAPI.getUserPosts),
  getTrendingPosts: createAction(GET_TRENDING_POSTS, PostsAPI.getTrendingPosts),
  prefetchTrendingPosts: createAction(PREFETCH_TRENDING_POSTS, PostsAPI.getTrendingPosts),
  getTagPosts: createAction(GET_TAG_POSTS, PostsAPI.getPublicPostsByTag),
  prefetchTagPosts: createAction(PREFETCH_TAG_POSTS, PostsAPI.getPublicPostsByTag),
  clearTagPosts: createAction(CLEAR_TAG_POSTS),
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
  trending: ListingSet,
  recent: ListingSet,
  user: ListingSet,
  tag: ListingSet,
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
  getTrendingPosts(): any;
  prefetchTrendingPosts(cursor: string): any;
  getTagPosts(payload: PostsAPI.GetPublicPostsByTagPayload): any;
  prefetchTagPosts(payload: PostsAPI.GetPublicPostsByTagPayload): any;
  clearTagPosts(): any;
  clearUserPosts(): any;
}

const initialState: Listing = {
  trending: {
    posts: null,
    prefetched: null,
    end: false,
  },
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
  tag: {
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
        draft.user = {
          posts: null,
          prefetched: null,
          end: false,
        };
      });
    },
    [CLEAR_TAG_POSTS]: (state) => {
      return produce(state, (draft) => {
        draft.tag = {
          posts: null,
          prefetched: null,
          end: false,
        };
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
    type: GET_TAG_POSTS,
    onSuccess: (state: Listing, action: PostsResponseAction) => {
      return produce(state, (draft) => {
        draft.tag = {
          end: action.payload.data.length < 20,
          posts: action.payload.data,
          prefetched: null,
        };
      });
    },
  },
  {
    type: PREFETCH_TAG_POSTS,
    onSuccess: (state: Listing, action: PostsResponseAction) => {
      const { data } = action.payload;
      return produce(state, (draft) => {
        draft.tag.prefetched = data;
        if (data && data.length === 0) {
          draft.tag.end = true;
        }
      });
    },
  },
  {
    type: GET_TRENDING_POSTS,
    onSuccess: (state: Listing, action: PostsResponseAction) => {
      return produce(state, (draft) => {
        draft.trending = {
          end: false,
          posts: action.payload.data,
          prefetched: null,
        };
      });
    },
  },
  {
    type: PREFETCH_TRENDING_POSTS,
    onSuccess: (state: Listing, action: PostsResponseAction) => {
      const { data } = action.payload;
      return produce(state, (draft) => {
        draft.trending.prefetched = data;
        if (data && data.length === 0) {
          draft.trending.end = true;
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
        if (action.payload.data.length < 20) {
          draft.user.end = true;
        }
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
