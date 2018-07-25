// @flow
import { createAction, handleActions, type ActionType } from 'redux-actions';
import { applyPenders, type GenericResponseAction } from 'lib/common';
import { getProfile } from 'lib/api/users';
import { updateProfile, type UpdateProfilePayload } from 'lib/api/me';
import produce from 'immer';
import { type Profile } from './profile';

const GET_PROFILE = 'settings/GET_PROFILE';
const UPDATE_PROFILE = 'settings/UPDATE_PROFILE';

export const actionCreators = {
  getProfile: createAction(GET_PROFILE, getProfile),
  updateProfile: createAction(UPDATE_PROFILE, updateProfile),
};

type GetProfileResponseAction = GenericResponseAction<Profile, string>;
type UpdateProfileResponseAction = GenericResponseAction<Profile, UpdateProfilePayload>;

export type SettingsState = {
  profile: ?Profile,
};

const initialState: SettingsState = {
  profile: null,
};

const reducer = handleActions({}, initialState);

export default applyPenders(reducer, [
  {
    type: GET_PROFILE,
    onSuccess: (state: SettingsState, action: GetProfileResponseAction) => {
      return {
        ...state,
        profile: action.payload.data,
      };
    },
  },
  {
    type: UPDATE_PROFILE,
    onSuccess: (state: SettingsState, action: UpdateProfileResponseAction) => {
      return {
        ...state,
        profile: action.payload.data,
      };
    },
  },
]);
