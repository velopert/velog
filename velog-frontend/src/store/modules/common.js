// @flow
import { createAction, handleActions, type ActionType } from 'redux-actions';
import { applyPenders, type GenericResponseAction } from 'lib/common';
import * as CommonAPI from 'lib/api/common';
import produce from 'immer';

const GET_TAGS = 'common/GET_TAGS';
const SET_TAG_INFO = 'common/SET_TAG_INFO';
const GET_TAG_INFO = 'common/GET_TAG_INFO';
const ASK_REMOVE = 'common/saves/ASK_REMOVE';
const CONFIRM_REMOVE = 'common/saves/CONFIRM_REMOVE';
const CANCEL_REMOVE = 'common/saves/CANCEL_REMOVE';

export type TagData = {
  name: string,
  posts_count: number,
};

export const actionCreators = {
  getTags: createAction(GET_TAGS, CommonAPI.getTags, meta => meta),
  setTagInfo: createAction(SET_TAG_INFO, (info: ?TagData) => info),
  getTagInfo: createAction(GET_TAG_INFO, CommonAPI.getTagInfo),
  askRemove: createAction(ASK_REMOVE, (postId: string) => postId),
  cancelRemove: createAction(CANCEL_REMOVE),
};

type GetTagsResponseAction = GenericResponseAction<TagData[], string>;
type GetTagInfoResponseAction = GenericResponseAction<TagData, string>;
type SetTagInfoAction = ActionType<typeof actionCreators.setTagInfo>;
type AskRemoveAction = ActionType<typeof actionCreators.askRemove>;

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
};

const reducer = handleActions(
  {
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
    [CANCEL_REMOVE]: (state) => {
      return produce(state, (draft) => {
        draft.saves.ask = false;
      });
    },
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
