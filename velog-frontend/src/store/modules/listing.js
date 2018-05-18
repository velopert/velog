// @flow
import { createAction, handleActions, type ActionType } from 'redux-actions';
import produce from 'immer';
import { applyPenders } from 'redux-pender';
import * as PostsAPI from 'lib/api/posts';

const GET_RECENT_POSTS = 'listing/GET_RECENT_POSTS';
const PREFETCH_RECENT_POSTS = 'listing/PREFETCH';
const REVEAL_PREFETCHED = 'listing/REVEAL_PREFETCHED';

export const actionCreators = {
  getRecentPosts: createAction(GET_RECENT_POSTS, PostsAPI.getPublicPosts),
  prefetchRecentPosts: createAction(PREFETCH_RECENT_POSTS, PostsAPI.getPublicPosts),
  revealPrefetched: createAction(REVEAL_PREFETCHED, (type: string) => type),
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
  recentPosts: ?(PostItem[]),
  prefetchedRecentPosts: ?(PostItem[]),
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
}

const initialState: Listing = {
  recentPosts: null,
  prefetchedRecentPosts: null,
};

const reducer = handleActions(
  {
    [REVEAL_PREFETCHED]: (state, action: RevealPrefetchedAction) => {
      return produce(state, (draft) => {
        if (!action) return;
        if (action.type === 'recent' && state.recentPosts && state.prefetchedRecentPosts) {
          draft.recentPosts = state.recentPosts.concat(state.prefetchedRecentPosts);
          draft.prefetchedRecentPosts = null;
        }
      });
    },
  },
  initialState,
);

console.log(applyPenders);
export default applyPenders(reducer, [
  {
    type: GET_RECENT_POSTS,
    onSuccess: (state: Listing, action: PostsResponseAction) => {
      return produce(state, (draft) => {
        draft.recentPosts = action.payload.data;
        draft.prefetchedRecentPosts = null;
      });
    },
  },
  {
    type: REVEAL_PREFETCHED,
    onSuccess: (state: Listing, action: PostsResponseAction) => {
      return produce(state, (draft) => {
        draft.prefetchedRecentPosts = action.payload.data;
      });
    },
  },
]);
