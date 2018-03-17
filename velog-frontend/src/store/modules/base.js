// @flow
import { createAction, handleActions, type ActionType } from 'redux-actions';
import produce from 'immer';

const SHOW_USER_MENU = 'base/SHOW_USER_MENU';
const HIDE_USER_MENU = 'base/HIDE_USER_MENU';
const SET_FULLSCREEN_LOADER = 'base/SET_FULLSCREEN_LOADER';

const showUserMenu = createAction(SHOW_USER_MENU);
const hideUserMenu = createAction(HIDE_USER_MENU);
const setFullscreenLoader = createAction(
  SET_FULLSCREEN_LOADER,
  (visibility: boolean) => visibility);

type ShowUserMenuAction = ActionType<typeof showUserMenu>;
type HideUserMenuAction = ActionType<typeof hideUserMenu>;
type SetFullscreenLoaderAction = ActionType<typeof setFullscreenLoader>;

export interface BaseActionCreators {
  showUserMenu(): any,
  hideUserMenu(): any,
  setFullscreenLoader(visibility: boolean): any
}

export const actionCreators: BaseActionCreators = {
  showUserMenu, hideUserMenu, setFullscreenLoader,
};

export type Base = {
  userMenu: boolean,
  fullscreenLoader: boolean
};

const initialState: Base = {
  userMenu: false,
  fullscreenLoader: false,
};

export default handleActions({
  [SHOW_USER_MENU]: state => produce(state, (draft) => {
    draft.userMenu = true;
  }),
  [HIDE_USER_MENU]: state => produce(state, (draft) => {
    draft.userMenu = false;
  }),
  [SET_FULLSCREEN_LOADER]: (state, action: SetFullscreenLoaderAction) => {
    return produce(state, (draft) => {
      draft.fullscreenLoader = action.payload;
    });
  },
}, initialState);