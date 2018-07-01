// @flow
import { createAction, handleActions, type ActionType } from 'redux-actions';
import produce from 'immer';
import { applyPenders } from 'lib/common';
import * as MeAPI from 'lib/api/me';

const FOLLOW_USER = 'follow/FOLLOW_USER';
const GET_USER_FOLLOW = 'follow/GET_USER_FOLLOW';
const UNFOLLOW_USER = 'follower/UNFOLLOW_USER';

export const actionCreators = {
  followUser: createAction(FOLLOW_USER, MeAPI.followUser, (meta: string) => meta),
  getUserFollow: createAction(GET_USER_FOLLOW, MeAPI.getUserFollow, (meta: string) => meta),
  unfollowUser: createAction(UNFOLLOW_USER, MeAPI.unfollowUser, (meta: string) => meta),
};

type FollowUser = {
  type: string,
  payload: any,
  meta: string,
};

type GetUserFollow = {
  type: string,
  payload: {
    data: { following: boolean },
  },
  meta: string,
};

type UnfollowUser = FollowUser;

export type FollowState = {
  users: {
    [string]: boolean,
  },
};

const initialState: FollowState = {
  users: {},
};

const reducer = handleActions({}, initialState);

export default applyPenders(reducer, [
  {
    type: FOLLOW_USER,
    onPending: (state: FollowState, action: FollowUser) => {
      return produce(state, (draft) => {
        draft.users[action.meta] = true;
      });
    },
    onFailure: (state: FollowState, action: FollowUser) => {
      if (action.payload.response.status === 409) return state;
      return produce(state, (draft) => {
        draft.users[action.meta] = false;
      });
    },
  },
  {
    type: GET_USER_FOLLOW,
    onSuccess: (state: FollowState, action: GetUserFollow) => {
      return produce(state, (draft) => {
        draft.users[action.meta] = action.payload.data.following;
      });
    },
  },
  {
    type: UNFOLLOW_USER,
    onPending: (state: FollowState, action: UnfollowUser) => {
      return produce(state, (draft) => {
        draft.users[action.meta] = false;
      });
    },
    onFailure: (state: FollowState, action: UnfollowUser) => {
      if (action.payload.response.status === 409) return state;
      return produce(state, (draft) => {
        draft.users[action.meta] = true;
      });
    },
  },
]);
