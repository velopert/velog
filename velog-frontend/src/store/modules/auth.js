// @flow
import { createAction, handleActions } from 'redux-actions';
import { Record, fromJS, type Map } from 'immutable';
import { pender } from 'redux-pender';
import * as AuthAPI from 'lib/api/auth';

const SET_EMAIL_INPUT = 'auth/SET_EMAIL_INPUT';
const SEND_AUTH_EMAIL = 'auth/SEND_AUTH_EMAIL';
const CHANGE_REGISTER_FORM = 'auth/CHANGE_REGISTER_FORM';

export const actionCreators = {
  setEmailInput: createAction(SET_EMAIL_INPUT, (value: string) => value),
  sendAuthEmail: createAction(SEND_AUTH_EMAIL, AuthAPI.sendAuthEmail),
  changeRegisterForm: createAction(CHANGE_REGISTER_FORM,
    (payload: { name: string, value: string }) => payload),
};

export type AuthActionCreators = {
  setEmailInput(value: string): any,
  sendAuthEmail(email: string): any,
  changeRegisterForm({ name: string, value: string }): any,
}

export type Auth = {
  email: string,
  sentEmail: boolean,
  registerForm: {
    name: string,
    email: string,
    username: string,
    shortBio: string
  }
};

const AuthRecord = Record(({
  email: '',
  sentEmail: false,
  registerForm: Record({
    name: '',
    email: '',
    username: '',
    shortBio: '',
  })(),
}:Auth));

const initialState: Auth = AuthRecord();

export default handleActions({
  [SET_EMAIL_INPUT]: (state, { payload: value }) => {
    return state.set('email', value);
  },
  ...pender({
    type: SEND_AUTH_EMAIL,
    onSuccess: (state) => {
      return state.set('sentEmail', true);
    },
  }),
  [CHANGE_REGISTER_FORM]: (state, { payload: { name, value } }) => {
    return state.setIn(['registerForm', name], value);
  },
}, initialState);
