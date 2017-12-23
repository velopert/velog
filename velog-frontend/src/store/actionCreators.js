// @flow
import { bindActionCreators } from 'redux';
import store from './index';
import { actionCreators as authActions, type AuthActionCreators } from './modules/auth';

const { dispatch } = store;

export const AuthActions: AuthActionCreators = bindActionCreators(authActions, dispatch);
