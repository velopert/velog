// @flow
import { createAction, handleActions, type ActionType } from 'redux-actions';
import { applyPenders, type GenericResponseAction } from 'lib/common';
import { getProfile } from 'lib/api/users';
import {
  updateProfile,
  createThumbnailSignedUrl,
  type UpdateProfilePayload,
  generateUnregisterToken,
  unregister,
  getEmailInfo,
} from 'lib/api/me';
import produce from 'immer';
import { type Profile } from './profile';

const GET_PROFILE = 'settings/GET_PROFILE';
const UPDATE_PROFILE = 'settings/UPDATE_PROFILE';
const CREATE_THUMBNAIL_SIGNED_URL = 'settings/CREATE_THUMBNAIL_SIGNED_URL'; // createThumbnailSignedUrl
const ASK_UNREGISTER = 'settings/ASK_UNREGISTER';
const GENERATE_UNREGISTER_TOKEN = 'settings/GENERATE_UNREGISTER_TOKEN';
const UNREGISTER = 'settings/UNREGISTER';
const GET_EMAIL_INFO = 'settings/GET_EMAIL_INFO';

export const actionCreators = {
  getProfile: createAction(GET_PROFILE, getProfile),
  updateProfile: createAction(UPDATE_PROFILE, updateProfile),
  createThumbnailSignedUrl: createAction(CREATE_THUMBNAIL_SIGNED_URL, createThumbnailSignedUrl),
  askUnregister: createAction(ASK_UNREGISTER, (open: boolean) => open),
  generateUnregisterToken: createAction(GENERATE_UNREGISTER_TOKEN, generateUnregisterToken),
  unregister: createAction(UNREGISTER, unregister),
  getEmailInfo: createAction(GET_EMAIL_INFO, getEmailInfo),
};

export type UploadInfo = {
  url: string,
  image_path: string,
  id: string,
};

export type EmailInfoData = {
  email: string | null,
  is_certified: boolean,
  permissions: {
    email_notification: boolean,
    email_promotion: boolean,
  },
};

type AskUnregisterAction = ActionType<typeof actionCreators.askUnregister>;
type GetProfileResponseAction = GenericResponseAction<Profile, string>;
type UpdateProfileResponseAction = GenericResponseAction<Profile, UpdateProfilePayload>;
type SignedUrlResponseAction = GenericResponseAction<UploadInfo, string>;
type GenerateUnregisterTokenResponseAction = GenericResponseAction<
  { unregister_token: string },
  void,
>;
type GetMailInfoResponseAction = GenericResponseAction<EmailInfoData, void>;

export type SettingsState = {
  profile: ?Profile,
  uploadInfo: ?UploadInfo,
  emailInfo: ?EmailInfoData,
  askUnregister: boolean,
  unregisterToken: ?string,
};

const initialState: SettingsState = {
  profile: null,
  uploadInfo: null,
  askUnregister: false,
  unregisterToken: null,
  emailInfo: null,
};

const reducer = handleActions(
  {
    [ASK_UNREGISTER]: (state, { payload }: AskUnregisterAction) => {
      return {
        ...state,
        askUnregister: payload,
      };
    },
  },
  initialState,
);

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
  {
    type: GENERATE_UNREGISTER_TOKEN,
    onSuccess: (state: SettingsState, action: GenerateUnregisterTokenResponseAction) => {
      return {
        ...state,
        unregisterToken: action.payload.data.unregister_token,
      };
    },
  },
  {
    type: GET_EMAIL_INFO,
    onSuccess: (state: SettingsState, action: GetMailInfoResponseAction) => {
      return {
        ...state,
        emailInfo: action.payload.data,
      };
    },
  },
]);
