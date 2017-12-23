// @flow
import { createAction, handleActions } from 'redux-actions';
import { Record, fromJS } from 'immutable';

const SET_EMAIL_INPUT = 'auth/SET_EMAIL_INPUT';

export const actionCreators = {
  setEmailInput: createAction(SET_EMAIL_INPUT, (value: string) => value),
};

export type AuthActionCreators = {
  setEmailInput(value: string): any,
}

export type AuthRecordType = {
  email: string,
};

const AuthRecord = Record(({
  email: '',
}:AuthRecordType));

const initialState = AuthRecord();

export default handleActions({
  [SET_EMAIL_INPUT]: (state: AuthRecord, { payload: value }) => {
    return state.set('email', value);
  },
}, initialState);
