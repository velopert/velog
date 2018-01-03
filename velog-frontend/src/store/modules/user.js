// @flow
import { createAction, handleActions } from 'redux-actions';
import { Record, fromJS, type Map } from 'immutable';
import { pender } from 'redux-pender';
import * as AuthAPI from 'lib/api/auth';

const CHECK_USER = 'user/CHECK_USER';
const SET_USER = 'user/SET_USER';
const PROCESS = 'user/PROCESS';

export type UserActionCreators = {
  checkUser(): any,
  setUser({ id: string, username: string, displayName: string}): any,
  process(): any
};

export const actionCreators = {
  checkUser: createAction(CHECK_USER, AuthAPI.check),
  setUser: createAction(SET_USER),
  process: createAction(PROCESS),
};

export type User = {
  user: ?{
    id: string,
    username: string,
    displayName: string
  },
  processed: boolean,
};

const UserSubrecord = Record({
  id: '',
  username: '',
  displayName: '',
});

const UserRecord = Record({
  user: null,
  processed: false,
});

const initialState: Map<string, *> = UserRecord();

export default handleActions({
  [SET_USER]: (state, { payload: user }) => {
    return state.set('user', UserSubrecord(user));
  },
  ...pender({
    type: CHECK_USER,
    onSuccess: (state, { payload: { data } }) => {
      return state.set('user', UserSubrecord(data.user))
        .set('processed', true);
    },
    onError: state => state.set('user', null).set('processed', true),
  }),
  [PROCESS]: state => state.set('processed', true),
}, initialState);
