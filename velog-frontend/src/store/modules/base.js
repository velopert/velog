// @flow
import { createAction, handleActions, type ActionType } from 'redux-actions';
import produce from 'immer';

const SHOW_USER_MENU = 'base/SHOW_USER_MENU';
const HIDE_USER_MENU = 'base/HIDE_USER_MENU';
const SET_FULLSCREEN_LOADER = 'base/SET_FULLSCREEN_LOADER';
const ENTER_LANDING = 'base/ENTER_LANDING';
const EXIT_LANDING = 'base/EXIT_LANDING';
const SET_WIDTH = 'base/SET_WIDTH';
const SHOW_TOAST = 'base/SHOW_TOAST';
const HIDE_TOAST = 'base/HIDE_TOAST';

const showUserMenu = createAction(SHOW_USER_MENU);
const hideUserMenu = createAction(HIDE_USER_MENU);
const setFullscreenLoader = createAction(
  SET_FULLSCREEN_LOADER,
  (visibility: boolean) => visibility,
);
const exitLanding = createAction(EXIT_LANDING);
const enterLanding = createAction(ENTER_LANDING);
const setWidth = createAction(SET_WIDTH, (width: number) => width);
const showToast = createAction(SHOW_TOAST, (payload: { type: string, message: string }) => payload);
const hideToast = createAction(HIDE_TOAST);

type ShowUserMenuAction = ActionType<typeof showUserMenu>;
type HideUserMenuAction = ActionType<typeof hideUserMenu>;
type SetFullscreenLoaderAction = ActionType<typeof setFullscreenLoader>;
type SetWidthAction = ActionType<typeof setWidth>;
type ShowToastAction = ActionType<typeof showToast>;

export interface BaseActionCreators {
  showUserMenu(): any;
  hideUserMenu(): any;
  setFullscreenLoader(visibility: boolean): any;
  exitLanding(): any;
  enterLanding(): any;
  setWidth(width: number): any;
  showToast(payload: { type: string, message: string }): any;
  hideToast(): any;
}

export const actionCreators: BaseActionCreators = {
  showUserMenu,
  hideUserMenu,
  setFullscreenLoader,
  exitLanding,
  enterLanding,
  setWidth,
  showToast,
  hideToast,
};

export type Base = {
  userMenu: boolean,
  fullscreenLoader: boolean,
  landing: boolean,
  windowWidth: number,
  toast: { type: ?string, message: ?string, visible: boolean },
};

const initialState: Base = {
  userMenu: false,
  fullscreenLoader: false,
  landing: true,
  windowWidth: 1920,
  toast: {
    type: null,
    message: null,
    visible: false,
  },
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
    [ENTER_LANDING]: (state) => {
      return produce(state, (draft) => {
        draft.landing = true;
      });
    },
    [SET_WIDTH]: (state, action: SetWidthAction) => {
      return produce(state, (draft) => {
        draft.windowWidth = action.payload;
      });
    },
    [SHOW_TOAST]: (state, { payload }: ShowToastAction) => {
      return {
        ...state,
        toast: {
          ...payload,
          visible: true,
        },
      };
    },
    [HIDE_TOAST]: (state) => {
      return produce(state, (draft) => {
        draft.toast.visible = false;
      });
    },
  },
  initialState,
);
