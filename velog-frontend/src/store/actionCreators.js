// @flow
import { bindActionCreators } from 'redux';
import store from './index';
import { actionCreators as authActions, type AuthActionCreators } from './modules/auth';
import { actionCreators as userActions, type UserActionCreators } from './modules/user';

const { dispatch } = store;

export const AuthActions: AuthActionCreators = bindActionCreators(authActions, dispatch);
export const UserActions: UserActionCreators = bindActionCreators(userActions, dispatch);
