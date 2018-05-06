// @flow
import { createAction, handleActions, type ActionType } from 'redux-actions';
import produce from 'immer';

const SHOW_USER_MENU = 'base/SHOW_USER_MENU';
const HIDE_USER_MENU = 'base/HIDE_USER_MENU';
const SET_FULLSCREEN_LOADER = 'base/SET_FULLSCREEN_LOADER';
const EXIT_LANDING = 'base/EXIT_LANDING';

const showUserMenu = createAction(SHOW_USER_MENU);
const hideUserMenu = createAction(HIDE_USER_MENU);
const setFullscreenLoader = createAction(
  SET_FULLSCREEN_LOADER,
  (visibility: boolean) => visibility,
);
const exitLanding = createAction(EXIT_LANDING);

type ShowUserMenuAction = ActionType<typeof showUserMenu>;
type HideUserMenuAction = ActionType<typeof hideUserMenu>;
type SetFullscreenLoaderAction = ActionType<typeof setFullscreenLoader>;

export interface BaseActionCreators {
  showUserMenu(): any;
  hideUserMenu(): any;
  setFullscreenLoader(visibility: boolean): any;
}

export const actionCreators: BaseActionCreators = {
  showUserMenu,
  hideUserMenu,
  setFullscreenLoader,
  exitLanding,
};

export type Base = {
  userMenu: boolean,
  fullscreenLoader: boolean,
  landing: boolean,
};

const initialState: Base = {
  userMenu: false,
  fullscreenLoader: false,
  landing: true,
};

export default handleActions(
  {
    [SHOW_USER_MENU]: state =>
      produce(state, (draft) => {
        draft.userMenu = true;
      }),
    [HIDE_USER_MENU]: state =>
      produce(state, (draft) => {
        draft.userMenu = false;
      }),
    [SET_FULLSCREEN_LOADER]: (state, action: SetFullscreenLoaderAction) => {
      return produce(state, (draft) => {
        draft.fullscreenLoader = action.payload;
      });
    },
    [EXIT_LANDING]: (state) => {
      return produce(state, (draft) => {
        draft.landing = false;
      });
    },
  },
  initialState,
);
