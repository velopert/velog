// @flow
import { createAction, handleActions, type ActionType } from 'redux-actions';
import { applyPenders, type GenericResponseAction } from 'lib/common';
import { getProfile } from 'lib/api/users';
import { updateProfile, createThumbnailSignedUrl, type UpdateProfilePayload } from 'lib/api/me';
import produce from 'immer';
import { type Profile } from './profile';

const GET_PROFILE = 'settings/GET_PROFILE';
const UPDATE_PROFILE = 'settings/UPDATE_PROFILE';
const CREATE_THUMBNAIL_SIGNED_URL = 'settings/CREATE_THUMBNAIL_SIGNED_URL'; // createThumbnailSignedUrl

export const actionCreators = {
  getProfile: createAction(GET_PROFILE, getProfile),
  updateProfile: createAction(UPDATE_PROFILE, updateProfile),
  createThumbnailSignedUrl: createAction(CREATE_THUMBNAIL_SIGNED_URL, createThumbnailSignedUrl),
};

export type UploadInfo = {
  url: string,
  image_path: string,
  id: string,
};

type GetProfileResponseAction = GenericResponseAction<Profile, string>;
type UpdateProfileResponseAction = GenericResponseAction<Profile, UpdateProfilePayload>;
type SignedUrlResponseAction = GenericResponseAction<UploadInfo, string>;

export type SettingsState = {
  profile: ?Profile,
  uploadInfo: ?UploadInfo,
};

const initialState: SettingsState = {
  profile: null,
  uploadInfo: null,
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
  {
    type: CREATE_THUMBNAIL_SIGNED_URL,
    onSuccess: (state: SettingsState, action: SignedUrlResponseAction) => {
      return {
        ...state,
        uploadInfo: action.payload.data,
      };
    },
  },
]);
