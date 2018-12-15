// @flow
import { createAction, handleActions, type ActionType } from 'redux-actions';
import { applyPenders, type GenericResponseAction } from 'lib/common';
import { getProfile } from 'lib/api/users';
import {
  updateProfile,
  updateProfileLinks,
  createThumbnailSignedUrl,
  generateUnregisterToken,
  unregister,
  getEmailInfo,
  changeEmail,
  resendCertmail,
  saveEmailPermissions,
  type UpdateProfilePayload,
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
const CHANGE_EMAIL = 'settings/CHANGE_EMAIL';
const RESEND_CERTMAIL = 'settings/RESEND_CERTMAIL';
const UPDATE_EMAIL_PERMISSION = 'settings/UPDATE_EMAIL_PERMISSION';
const SAVE_EMAIL_PERMISSIONS = 'settings/SAVE_EMAIL_PERMISSIONS';
const UPDATE_PROFILE_LINKS = 'settings/UPDATE_PROFILE_LINKS';

export const actionCreators = {
  getProfile: createAction(GET_PROFILE, getProfile),
  updateProfile: createAction(UPDATE_PROFILE, updateProfile),
  createThumbnailSignedUrl: createAction(CREATE_THUMBNAIL_SIGNED_URL, createThumbnailSignedUrl),
  askUnregister: createAction(ASK_UNREGISTER, (open: boolean) => open),
  generateUnregisterToken: createAction(GENERATE_UNREGISTER_TOKEN, generateUnregisterToken),
  unregister: createAction(UNREGISTER, unregister),
  getEmailInfo: createAction(GET_EMAIL_INFO, getEmailInfo),
  changeEmail: createAction(CHANGE_EMAIL, changeEmail),
  resendCertmail: createAction(RESEND_CERTMAIL, resendCertmail),
  updateEmailPermission: createAction(
    UPDATE_EMAIL_PERMISSION,
    (payload: { name: string, value: boolean }) => payload,
  ),
  saveEmailPermissions: createAction(SAVE_EMAIL_PERMISSIONS, saveEmailPermissions),
  updateProfileLinks: createAction(UPDATE_PROFILE_LINKS, updateProfileLinks),
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

export type ProfileLinks = {
  url?: string,
  email?: string,
  github?: string,
  twitter?: string,
  facebook?: string,
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
type UpdateEmailPermissionAction = ActionType<typeof actionCreators.updateEmailPermission>;
type UpdateProfileLinksResponseAction = GenericResponseAction<ProfileLinks, void>;

type SettingProfile = Profile & {
  profile_links: ProfileLinks,
};
export type SettingsState = {
  profile: ?SettingProfile,
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
    [UPDATE_EMAIL_PERMISSION]: (state, { payload }: UpdateEmailPermissionAction) => {
      return produce(state, (draft) => {
        if (!draft.emailInfo) return;
        draft.emailInfo.permissions[payload.name] = payload.value;
      });
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
  {
    type: UPDATE_PROFILE_LINKS,
    onSuccess: (state: SettingsState, action: UpdateProfileLinksResponseAction) => {
      return produce(state, (draft) => {
        if (!draft.profile) return;
        draft.profile.profile_links = action.payload.data;
      });
    },
  },
]);
