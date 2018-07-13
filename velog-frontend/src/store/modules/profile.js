// @flow
import { createAction, handleActions, type ActionType } from 'redux-actions';
import produce from 'immer';
import { applyPenders, type GenericResponseAction } from 'lib/common';
import * as UsersAPI from 'lib/api/users';
import * as CommonAPI from 'lib/api/common';

const GET_USER_TAGS = 'profile/GET_USER_TAGS';
const GET_PROFILE = 'profile/GET_PROFILE';
const SET_RAW_TAG_NAME = 'profile/SET_RAW_TAG_NAME';
const GET_TAG_INFO = 'profile/GET_TAG_INFO';

export const actionCreators = {
  getUserTags: createAction(GET_USER_TAGS, UsersAPI.listUserTags),
  getProfile: createAction(GET_PROFILE, UsersAPI.getProfile),
  setRawTagName: createAction(SET_RAW_TAG_NAME, (tagName: string) => tagName),
  getTagInfo: createAction(GET_TAG_INFO, CommonAPI.getTagInfo),
};

export type TagCountInfo = {
  tag: string,
  count: number,
};

export type Profile = {
  user_id: string,
  display_name: string,
  thumbnail: ?string,
  short_bio: string,
};

type TagData = {
  name: string,
  posts_count: number,
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

type SetRawTagNameAction = ActionType<typeof actionCreators.setRawTagName>;
type GetTagInfoResponseAction = GenericResponseAction<TagData, string>;

export type ProfileState = {
  tagCounts: ?(TagCountInfo[]),
  profile: ?Profile,
  rawTagName: ?string,
};

const initialState = {
  tagCounts: null,
  profile: null,
  rawTagName: null,
};

const reducer = handleActions(
  {
    [SET_RAW_TAG_NAME]: (state, { payload }: SetRawTagNameAction) => {
      return {
        ...state,
        rawTagName: payload,
      };
    },
  },
  initialState,
);

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
    onPending: (state: ProfileState) => {
      return {
        ...state,
        rawTagName: null,
      };
    },
    onSuccess: (state: ProfileState, action: ProfileResponseAction) => {
      return {
        ...state,
        profile: action.payload.data,
      };
    },
  },
  {
    type: GET_TAG_INFO,
    onSuccess: (state: ProfileState, { payload }: GetTagInfoResponseAction) => {
      return {
        ...state,
        rawTagName: payload.data.name,
      };
    },
  },
]);
