// @flow
import { createAction, handleActions } from 'redux-actions';
import { Record, fromJS, type Map } from 'immutable';
import { pender } from 'redux-pender';
import * as AuthAPI from 'lib/api/auth';

const SET_EMAIL_INPUT = 'auth/SET_EMAIL_INPUT';
const SEND_VERIFICATION_EMAIL = 'auth/SEND_VERIFICATION_EMAIL';

export const actionCreators = {
  setEmailInput: createAction(SET_EMAIL_INPUT, (value: string) => value),
  sendVerificationEmail: createAction(SEND_VERIFICATION_EMAIL, AuthAPI.sendVerificationEmail),
};

export type AuthActionCreators = {
  setEmailInput(value: string): any,
  sendVerificationEmail(email: string): any
}

export type Auth = {
  email: string,
  sentEmail: boolean
};

const AuthRecord = Record(({
  email: '',
  sentEmail: false,
}:Auth));

const initialState = AuthRecord();

export default handleActions({
  [SET_EMAIL_INPUT]: (state, { payload: value }) => {
    return state.set('email', value);
  },
  ...pender({
    type: SEND_VERIFICATION_EMAIL,
    onSuccess: (state) => {
      return state.set('sentEmail', true);
    },
  }),
}, initialState);
