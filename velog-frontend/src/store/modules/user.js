// @flow
import { createAction, handleActions, type ActionType } from 'redux-actions';
import produce from 'immer';
import { applyPenders } from 'lib/common';
import * as AuthAPI from 'lib/api/auth';

/* ACTION TYPE */
const CHECK_USER = 'user/CHECK_USER';
const SET_USER = 'user/SET_USER';
const PROCESS_USER = 'user/PROCESS_USER';
const LOGOUT = 'user/LOGOUT';

/* ACTION CREATOR */
const checkUser = createAction(CHECK_USER, AuthAPI.check);

type SetUserPayload = {
  id: string,
  username: string,
  displayName: string,
  thumbnail?: ?string,
};
const setUser = createAction(SET_USER, (payload: SetUserPayload) => payload);
const processUser = createAction(PROCESS_USER);
const logout = createAction(LOGOUT, AuthAPI.logout);

/* ACTION FLOW TYPE */
type CheckUserAction = ActionType<typeof checkUser>;
type SetUserAction = ActionType<typeof setUser>;
type ProcessUserAction = ActionType<typeof processUser>;
type LogoutAction = ActionType<typeof logout>;

/* ACTION CREATORS INTERFACE */
export interface UserActionCreators {
  checkUser(): any;
  setUser(payload: SetUserPayload): any;
  processUser(): any;
  logout(): any;
}

/* EXPORT ACTION CREATORS */
export const actionCreators: UserActionCreators = {
  checkUser,
  setUser,
  processUser,
  logout,
};

/* STATE TYPES */
export type UserData = {
  id: string,
  username: string,
  displayName: string,
  thumbnail?: ?string,
};

export type User = {
  user: ?UserData,
  processed: boolean,
};

/* INITIAL STATE */
const initialState: User = {
  user: null,
  processed: false,
};

/* REDUCER */
const reducer = handleActions(
  {
    [SET_USER]: (state, action: SetUserAction) => {
      return produce(state, (draft) => {
        if (!action) return;
        draft.user = action.payload;
      });
    },
    [PROCESS_USER]: (state, action: ProcessUserAction) => {
      return produce(state, (draft) => {
        draft.processed = true;
      });
    },
  },
  initialState,
);

export default applyPenders(reducer, [
  {
    type: CHECK_USER,
    onSuccess: (state, { payload: { data } }) => {
      return produce(state, (draft) => {
        draft.user = data.user;
        draft.processed = true;
      });
    },
    onError: state =>
      produce(state, (draft) => {
        draft.user = null;
        draft.processed = true;
      }),
  },
]);
