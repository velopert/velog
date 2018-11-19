// @flow
import { createAction, handleActions, type ActionType } from 'redux-actions';
import { applyPenders, type GenericResponseAction } from 'lib/common';
import * as CommonAPI from 'lib/api/common';
import produce from 'immer';
import * as PostsAPI from 'lib/api/posts';
import { type Location } from 'react-router-dom';

const GET_TAGS = 'common/GET_TAGS';
const SET_TAG_INFO = 'common/SET_TAG_INFO';
const GET_TAG_INFO = 'common/GET_TAG_INFO';
const ASK_REMOVE = 'common/saves/ASK_REMOVE';
const CLOSE_REMOVE = 'common/saves/CLOSE_REMOVE';
const REMOVE_POST = 'common/saves/REMOVE_POST';
const CHANGE_ROUTE = 'common/router/CHANGE_ROUTE';
const DID_SSR = 'common/DID_SSR';

export type TagData = {
  name: string,
  posts_count: number,
};

export type HistoryPayload = Location & { type: string };

export const actionCreators = {
  getTags: createAction(GET_TAGS, CommonAPI.getTags, meta => meta),
  setTagInfo: createAction(SET_TAG_INFO, (info: ?TagData) => info),
  getTagInfo: createAction(GET_TAG_INFO, CommonAPI.getTagInfo),
  askRemove: createAction(ASK_REMOVE, (postId: string) => postId),
  closeRemove: createAction(CLOSE_REMOVE),
  removePost: createAction(REMOVE_POST, PostsAPI.deletePost),
  changeRoute: createAction(CHANGE_ROUTE, (payload: HistoryPayload) => payload),
  didSSR: createAction(DID_SSR),
};

type GetTagsResponseAction = GenericResponseAction<TagData[], string>;
type GetTagInfoResponseAction = GenericResponseAction<TagData, string>;
type SetTagInfoAction = ActionType<typeof actionCreators.setTagInfo>;
type AskRemoveAction = ActionType<typeof actionCreators.askRemove>;
type ChangeRouteAction = ActionType<typeof actionCreators.changeRoute>;

export type CommonState = {
  tags: {
    data: ?(TagData[]),
    selected: ?TagData,
    lastParam: ?string,
    sort: string,
  },
  saves: {
    removeId: ?string,
    ask: boolean,
  },
  router: {
    history: Location[],
    altered: boolean,
  },
  ssr: boolean,
};

const initialState: CommonState = {
  tags: {
    data: null,
    selected: null,
    lastParam: null,
    sort: 'popular',
  },
  saves: {
    removeId: null,
    ask: false,
  },
  router: {
    history: [],
    altered: false,
  },
  ssr: false,
};

const reducer = handleActions(
  {
    // $FlowFixMe
    [SET_TAG_INFO]: (state, { payload }: SetTagInfoAction) => {
      return produce(state, (draft) => {
        draft.tags.selected = payload;
      });
    },
    [ASK_REMOVE]: (state, { payload }: AskRemoveAction) => {
      return produce(state, (draft) => {
        draft.saves.ask = true;
        draft.saves.removeId = payload;
      });
    },
    [CLOSE_REMOVE]: (state) => {
      return produce(state, (draft) => {
        draft.saves.ask = false;
      });
    },
    [CHANGE_ROUTE]: (state, { payload }: ChangeRouteAction) => {
      return produce(state, (draft) => {
        const { type, ...rest } = payload;
        draft.router.altered = true;
        if (type === 'PUSH') {
          draft.router.history.push(rest);
        }
        if (type === 'POP') {
          draft.router.history.pop();
        }
        if (type === 'REPLACE') {
          draft.router.history[draft.router.history.length - 1] = payload;
        }
      });
    },
    [DID_SSR]: state => ({
      ...state,
      ssr: true,
    }),
  },
  initialState,
);

export default applyPenders(reducer, [
  {
    type: GET_TAGS,
    onSuccess: (state: CommonState, { payload, meta }: GetTagsResponseAction) => {
      return produce(state, (draft) => {
        draft.tags.data = payload.data;
        draft.tags.sort = meta;
      });
    },
  },
  {
    type: GET_TAG_INFO,
    onPending: (state: CommonState, action) => {
      return produce(state, (draft) => {
        draft.tags.lastParam = action.meta;
      });
    },
    onSuccess: (state: CommonState, { payload }: GetTagInfoResponseAction) => {
      return produce(state, (draft) => {
        draft.tags.selected = payload.data;
      });
    },
  },
]);
