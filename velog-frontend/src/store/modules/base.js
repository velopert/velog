// @flow
import { createAction, handleActions } from 'redux-actions';
import { Record, type Map } from 'immutable';

const SHOW_USER_MENU = 'base/SHOW_USER_MENU';
const HIDE_USER_MENU = 'base/HIODE_USER_MENU';

export type BaseActionCreators = {
  showUserMenu(): any,
  hideUserMenu(): any
};

export const actionCreators = {
  showUserMenu: createAction(SHOW_USER_MENU),
  hideUserMenu: createAction(HIDE_USER_MENU),
};

export type Base = {
  userMenu: boolean
}

const BaseRecord = Record({
  userMenu: false,
});

const initialState: Map<string, *> = BaseRecord();

export default handleActions({
  [SHOW_USER_MENU]: state => state.set('userMenu', true),
  [HIDE_USER_MENU]: state => state.set('userMenu', false),
}, initialState);