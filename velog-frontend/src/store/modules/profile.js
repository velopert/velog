// @flow
import { createAction, handleActions, type ActionType } from 'redux-actions';
import produce from 'immer';
import { applyPenders } from 'lib/common';
import * as UsersAPI from 'lib/api/users';

const GET_USER_TAGS = 'profile/GET_USER_TAGS';
const GET_PROFILE = 'profile/GET_PROFILE';

export const actionCreators = {
  getUserTags: createAction(GET_USER_TAGS, UsersAPI.listUserTags),
  getProfile: createAction(GET_PROFILE, UsersAPI.getProfile),
};

export type TagCountInfo = {
  tag: string,
  count: number,
};

export type Profile = {
  display_name: string,
  thumbnail: ?string,
  short_bio: string,
};

type UserTagsResponseAction = {
  type: string,
  payload: {
    data: TagCountInfo[],
  },
};

type ProfileResponseAction = {
  type: string,
  payload: {
    data: Profile,
  },
};

export type ProfileState = {
  tagCounts: ?(TagCountInfo[]),
  profile: ?Profile,
};

const initialState = {
  tagCounts: null,
  profile: null,
};

const reducer = handleActions({}, initialState);

export default applyPenders(reducer, [
  {
    type: GET_USER_TAGS,
    onSuccess: (state: ProfileState, action: UserTagsResponseAction) => {
      return {
        ...state,
        tagCounts: action.payload.data,
      };
    },
  },
  {
    type: GET_PROFILE,
    onSuccess: (state: ProfileState, action: ProfileResponseAction) => {
      return {
        ...state,
        profile: action.payload.data,
      };
    },
  },
]);
