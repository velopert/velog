// @flow
import { createAction, handleActions } from 'redux-actions';
import { Record, fromJS, type Map } from 'immutable';
import { pender } from 'redux-pender';
import * as AuthAPI from 'lib/api/auth';


const SET_EMAIL_INPUT = 'auth/SET_EMAIL_INPUT';
const SEND_AUTH_EMAIL = 'auth/SEND_AUTH_EMAIL';
const CHANGE_REGISTER_FORM = 'auth/CHANGE_REGISTER_FORM';
const GET_CODE = 'auth/GET_CODE';
const LOCAL_REGISTER = 'auth/LOCAL_REGISTER';
const CODE_LOGIN = 'auth/CODE_LOGIN';


export type AuthActionCreators = {
  setEmailInput(value: string): any,
  sendAuthEmail(email: string): any,
  changeRegisterForm({ name: string, value: string }): any,
  getCode(code: string): any,
  localRegister(payload: AuthAPI.LocalRegisterPayload): any,
  codeLogin(code: string): any
}

export const actionCreators = {
  setEmailInput: createAction(SET_EMAIL_INPUT),
  sendAuthEmail: createAction(SEND_AUTH_EMAIL, AuthAPI.sendAuthEmail),
  getCode: createAction(GET_CODE, AuthAPI.getCode),
  changeRegisterForm: createAction(CHANGE_REGISTER_FORM),
  localRegister: createAction(LOCAL_REGISTER, AuthAPI.localRegister),
  codeLogin: createAction(CODE_LOGIN, AuthAPI.codeLogin),
};

export type Auth = {
  email: string,
  sentEmail: boolean,
  isUser: boolean,
  registerForm: {
    displayName: string,
    email: string,
    username: string,
    shortBio: string
  },
  registerToken: string,
  authResult: ?{
    user: {
      id: string,
      username: string,
      displayName: string,
    },
    token: string
  }
};

const UserSubrecord = Record({
  id: '',
  username: '',
  displayName: '',
});

const AuthResultSubrecord = Record({
  user: UserSubrecord(),
  token: '',
});

const AuthRecord = Record(({
  email: '',
  sentEmail: false,
  isUser: false,
  registerForm: Record({
    displayName: '',
    email: '',
    username: '',
    shortBio: '',
  })(),
  registerToken: '',
  authResult: null,
}:Auth));

const initialState: Auth = AuthRecord();

export default handleActions({
  [SET_EMAIL_INPUT]: (state, { payload: value }) => {
    return state.set('email', value);
  },
  ...pender({
    type: SEND_AUTH_EMAIL,
    onSuccess: (state, { payload: { data } }) => {
      return state.set('sentEmail', true)
        .set('isUser', data.isUser);
    },
  }),
  [CHANGE_REGISTER_FORM]: (state, { payload: { name, value } }) => {
    return state.setIn(['registerForm', name], value);
  },
  ...pender({
    type: GET_CODE,
    onSuccess: (state, { payload: { data } }) => {
      const { email, registerToken } = data;
      return state.setIn(['registerForm', 'email'], email)
        .set('registerToken', registerToken);
    },
  }),
  ...pender({
    type: LOCAL_REGISTER,
    onSuccess: (state, { payload: { data } }) => {
      const { user, token } = data;
      return state.set('authResult', AuthResultSubrecord({
        user: UserSubrecord(user),
        token,
      }));
    },
  }),
  ...pender({
    type: CODE_LOGIN,
    onSuccess: (state, { payload: { data } }) => {
      const { user, token } = data;
      return state.set('authResult', AuthResultSubrecord({
        user: UserSubrecord(user),
        token,
      }));
    },
  }),
}, initialState);
