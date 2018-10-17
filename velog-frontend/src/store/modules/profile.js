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
const INITIALIZE = 'profile/INITIALIZE';
const SET_SIDE_VISIBILITY = 'profile/SET_SIDE_VISIBILITY';
const GET_USER_HISTORY = 'profile/GET_USER_HISTORY';
const REVEAL_PREFETCHED_HISTORY = 'profile/REVEAL_PREFETCHED_HISTORY';
const PREFETCH_USER_HISTORY = 'profile/PREFETCH_USER_HISTORY';

export const actionCreators = {
  initialize: createAction(INITIALIZE),
  getUserTags: createAction(GET_USER_TAGS, UsersAPI.listUserTags),
  getProfile: createAction(GET_PROFILE, UsersAPI.getProfile),
  setRawTagName: createAction(SET_RAW_TAG_NAME, (tagName: string) => tagName),
  getTagInfo: createAction(GET_TAG_INFO, CommonAPI.getTagInfo),
  setSideVisibility: createAction(SET_SIDE_VISIBILITY, (visible: boolean) => visible),
  getUserHistory: createAction(GET_USER_HISTORY, UsersAPI.getHistory),
  revealPrefetchedHistory: createAction(REVEAL_PREFETCHED_HISTORY),
  prefetchUserHistory: createAction(PREFETCH_USER_HISTORY, UsersAPI.getHistory),
};

export type TagCountInfo = {
  tag: string,
  count: number,
};

export type Profile = {
  id: string,
  display_name: string,
  thumbnail: ?string,
  short_bio: string,
  username: string,
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

export type UserHistoryItem = {
  id: string,
  created: string,
  type: 'comment' | 'like',
  text: ?string,
  post: {
    title: string,
    url_slug: string,
    thumbnail: string,
    short_description: string,
    user: {
      username: string,
      display_name: string,
      thumbnail: string,
    },
  },
};

type SetRawTagNameAction = ActionType<typeof actionCreators.setRawTagName>;
type GetTagInfoResponseAction = GenericResponseAction<TagData, string>;
type SetSideVisibilityAction = ActionType<typeof actionCreators.setSideVisibility>;
type GetUserHistoryResponseAction = GenericResponseAction<UserHistoryItem[], any>;

export type ProfileState = {
  tagCounts: ?(TagCountInfo[]),
  profile: ?Profile,
  userHistory: ?(UserHistoryItem[]),
  prefetchedHistory: ?(UserHistoryItem[]),
  rawTagName: ?string,
  side: boolean,
};

const initialState = {
  tagCounts: null,
  profile: null,
  rawTagName: null,
  userHistory: null,
  prefetchedHistory: null,
  side: true,
};

const reducer = handleActions(
  {
    [INITIALIZE]: state => ({ ...initialState, side: state.side }),
    [SET_RAW_TAG_NAME]: (state, { payload }: SetRawTagNameAction) => {
      return {
        ...state,
        rawTagName: payload,
      };
    },
    [SET_SIDE_VISIBILITY]: (state, { payload }: SetSideVisibilityAction) => {
      return {
        ...state,
        side: payload,
      };
    },
    [REVEAL_PREFETCHED_HISTORY]: (state) => {
      return produce(state, (draft) => {
        if (!draft.userHistory || !draft.prefetchedHistory) return;
        draft.userHistory = draft.userHistory.concat(draft.prefetchedHistory);
        draft.prefetchedHistory = null;
      });
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
  {
    type: GET_USER_HISTORY,
    onPending: (state: ProfileState) => {
      return {
        ...state,
        prefetchedHistory: null,
      };
    },
    onSuccess: (state: ProfileState, { payload }: GetUserHistoryResponseAction) => {
      return {
        ...state,
        userHistory: payload.data,
      };
    },
  },
  {
    type: PREFETCH_USER_HISTORY,
    onSuccess: (state: ProfileState, { payload }: GetUserHistoryResponseAction) => {
      const currentIdList = (state.userHistory || []).map(item => item.id);
      const filtered = payload.data.filter(item => currentIdList.indexOf(item.id) === -1);
      return {
        ...state,
        prefetchedHistory: filtered,
      };
    },
  },
]);
