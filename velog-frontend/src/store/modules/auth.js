// @flow
import { createAction, handleActions, type ActionType } from 'redux-actions';
import produce from 'immer';
import { pender } from 'redux-pender';
import * as AuthAPI from 'lib/api/auth';
import * as socialAuth from 'lib/socialAuth';
import { applyPenders } from 'lib/common';

/* ACTION TYPE */
const SET_EMAIL_INPUT = 'auth/SET_EMAIL_INPUT';
const SEND_AUTH_EMAIL = 'auth/SEND_AUTH_EMAIL';
const CHANGE_REGISTER_FORM = 'auth/CHANGE_REGISTER_FORM';
const GET_CODE = 'auth/GET_CODE';
const LOCAL_REGISTER = 'auth/LOCAL_REGISTER';
const CODE_LOGIN = 'auth/CODE_LOGIN';
const SOCIAL_LOGIN = 'auth/SOCIAL_LOGIN';
const VERIFY_SOCIAL = 'auth/VERIFY_SOCIAL';
const SOCIAL_REGISTER = 'auth/SOCIAL_REGISTER';
const SOCIAL_VELOG_LOGIN = 'auth/SOCIAL_VELOG_LOGIN';
const AUTOCOMPLETE_REGISTER_FORM = 'auth/AUTOCOMPLETE_REGISTER_FORM';
const SET_ERROR = 'auth/SET_ERROR';
const SET_NEXT_URL = 'auth/SET_NEXT_URL';

/* ACTION CREATOR */
const setEmailInput = createAction(SET_EMAIL_INPUT, (value: string) => value);
const sendAuthEmail = createAction(SEND_AUTH_EMAIL, AuthAPI.sendAuthEmail);
const getCode = createAction(GET_CODE, AuthAPI.getCode);

type ChangeRegisterFormPayload = { name: string, value: string };
const changeRegisterForm = createAction(
  CHANGE_REGISTER_FORM,
  (payload: ChangeRegisterFormPayload) => payload,
);

const localRegister = createAction(LOCAL_REGISTER, AuthAPI.localRegister);
const codeLogin = createAction(CODE_LOGIN, AuthAPI.codeLogin);
const socialLogin = createAction(
  SOCIAL_LOGIN,
  (provider: string) => socialAuth[provider](),
  provider => provider,
);
const verifySocial = createAction(VERIFY_SOCIAL, AuthAPI.verifySocial);
const socialRegister = createAction(SOCIAL_REGISTER, AuthAPI.socialRegister);
const socialVelogLogin = createAction(SOCIAL_VELOG_LOGIN, AuthAPI.socialLogin);

type ErrorType = { name: string, payload?: ?any };
const setError = createAction(SET_ERROR, (payload: ErrorType) => payload);

const setNextUrl = createAction(SET_NEXT_URL, (payload: string) => payload);

type AutoCompleteFormPayload = {
  email: string,
  name: string,
};
const autoCompleteRegisterForm = createAction(
  AUTOCOMPLETE_REGISTER_FORM,
  (payload: AutoCompleteFormPayload) => payload,
);

/* ACTION FLOW TYPE */
type SetEmailInputAction = ActionType<typeof setEmailInput>;
type SendAuthEmailAction = ActionType<typeof sendAuthEmail>;
type GetCodeAction = ActionType<typeof getCode>;
type ChangeRegisterFormAction = ActionType<typeof changeRegisterForm>;
type LocalRegisterAction = ActionType<typeof localRegister>;
type CodeLoginAction = ActionType<typeof codeLogin>;
type SocialLoginAction = ActionType<typeof socialLogin>;
type VerifySocialAction = ActionType<typeof verifySocial>;
type SocialRegisterAction = ActionType<typeof socialRegister>;
type SocialVelogLoginAction = ActionType<typeof socialVelogLogin>;
type AutoCompleteRegisterForm = ActionType<typeof autoCompleteRegisterForm>;
type SetErrorAction = ActionType<typeof setError>;
type SetNextUrlAction = ActionType<typeof setNextUrl>;

/* ACTION CREATORS INTERFACE */
export interface AuthActionCreators {
  setEmailInput(value: string): any;
  sendAuthEmail(email: string): any;
  changeRegisterForm({ name: string, value: string }): any;
  getCode(code: string): any;
  localRegister(payload: AuthAPI.LocalRegisterPayload): any;
  codeLogin(code: string): any;
  socialLogin(provider: string): any;
  verifySocial(payload: AuthAPI.VerifySocialPayload): any;
  socialRegister(payload: AuthAPI.SocialRegisterPayload): any;
  socialVelogLogin(payload: AuthAPI.SocialLoginPayload): any;
  autoCompleteRegisterForm(payload: AutoCompleteFormPayload): any;
  setError(payload: ErrorType): any;
  setNextUrl(payload: string): any;
}

/* EXPORT ACTION CREATORS */
export const actionCreators: AuthActionCreators = {
  setEmailInput,
  sendAuthEmail,
  changeRegisterForm,
  getCode,
  localRegister,
  codeLogin,
  socialLogin,
  verifySocial,
  socialRegister,
  socialVelogLogin,
  autoCompleteRegisterForm,
  setError,
  setNextUrl,
};

/* STATE TYPES */
export type SocialAuthResult = ?{
  provider: string,
  accessToken: string,
};

export type AuthResult = ?{
  user: {
    id: string,
    username: string,
    displayName: string,
    thumbnail?: ?string,
  },
  token: string,
};

export type VerifySocialResult = ?{
  id: string,
  thumbnail: ?string,
  email: ?string,
  name: ?string,
  exists: boolean,
};

export type Auth = {
  email: string,
  sentEmail: boolean,
  isUser: boolean,
  registerForm: {
    displayName: string,
    email: string,
    username: string,
    shortBio: string,
  },
  isSocial: boolean,
  registerToken: string,
  authResult: AuthResult,
  socialAuthResult: SocialAuthResult,
  verifySocialResult: VerifySocialResult,
  error: ?{
    name: string,
    payload: any,
  },
  nextUrl: ?string,
};

/* INITIAL STATE */
const initialState: Auth = {
  email: '',
  sentEmail: false,
  isUser: false,
  registerForm: {
    displayName: '',
    email: '',
    username: '',
    shortBio: '',
  },
  isSocial: false,
  registerToken: '',
  authResult: null,
  socialAuthResult: null,
  verifySocialResult: null,
  error: null,
  nextUrl: null,
};

/* REDUCER */
const reducer = handleActions(
  {
    [SET_EMAIL_INPUT]: (state, action: SetEmailInputAction) => {
      return produce(state, (draft) => {
        if (!action) return;
        draft.email = action.payload;
      });
    },
    [CHANGE_REGISTER_FORM]: (state, action: ChangeRegisterFormAction) => {
      const {
        payload: { name, value },
      } = action;
      return produce(state, (draft) => {
        draft.registerForm[name] = value;
      });
    },
    [AUTOCOMPLETE_REGISTER_FORM]: (state, action: AutoCompleteRegisterForm) => {
      const { email, name } = action.payload;
      return produce(state, (draft) => {
        draft.registerForm = {
          displayName: name,
          email,
          shortBio: '',
          username: '',
        };
        draft.isSocial = true;
      });
    },
    [SET_ERROR]: (state, { payload }: SetErrorAction) => {
      return produce(state, (draft) => {
        draft.error = payload;
      });
    },
    [SET_NEXT_URL]: (state, { payload }: SetNextUrlAction) => {
      return {
        ...state,
        nextUrl: payload,
      };
    },
  },
  initialState,
);

export default applyPenders(reducer, [
  {
    type: SEND_AUTH_EMAIL,
    onSuccess: (state: Auth, { payload: { data } }) => {
      return produce(state, (draft) => {
        draft.sentEmail = true;
        draft.isUser = data.isUser; // TODO: snake_case
      });
    },
  },
  {
    type: GET_CODE,
    onSuccess: (state: Auth, { payload: { data } }) => {
      const { email, registerToken } = data;
      return produce(state, (draft) => {
        draft.registerForm.email = email;
        draft.registerToken = registerToken;
      });
    },
  },
  {
    type: LOCAL_REGISTER,
    onSuccess: (state: Auth, { payload: { data } }) => {
      const { user, token } = data;
      return produce(state, (draft) => {
        draft.authResult = {
          user,
          token,
        };
      });
    },
    onFailure: (state: Auth, { payload: { response } }) => {
      return produce(state, (draft) => {
        draft.error = response.data;
      });
    },
  },
  {
    type: CODE_LOGIN,
    onSuccess: (state: Auth, { payload: { data } }) => {
      const { user, token } = data;
      return produce(state, (draft) => {
        draft.authResult = {
          user,
          token,
        };
      });
    },
  },
  {
    type: SOCIAL_LOGIN,
    onSuccess: (state: Auth, { payload: response, meta: provider }) => {
      if (!response) return state;
      const { access_token: accessToken } = response.authResponse;
      return produce(state, (draft) => {
        draft.socialAuthResult = {
          accessToken,
          provider,
        };
      });
    },
  },
  {
    type: VERIFY_SOCIAL,
    onSuccess: (state: Auth, { payload: response }) => {
      const { profile, exists } = response.data;
      const { id, thumbnail, email, name } = profile;
      return produce(state, (draft) => {
        draft.verifySocialResult = {
          id,
          thumbnail,
          email,
          name,
          exists,
        };
      });
    },
  },
  {
    type: SOCIAL_VELOG_LOGIN,
    onSuccess: (state: Auth, { payload: { data } }) => {
      const { user, token } = data;
      return produce(state, (draft) => {
        draft.authResult = {
          user,
          token,
        };
      });
    },
  },
  {
    type: SOCIAL_REGISTER,
    onSuccess: (state: Auth, { payload: { data } }) => {
      const { user, token } = data;
      return produce(state, (draft) => {
        draft.authResult = { user, token };
      });
    },
    onFailure: (state: Auth, { payload: { response } }) => {
      return produce(state, (draft) => {
        draft.error = response.data;
      });
    },
  },
]);
