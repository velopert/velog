// @flow
import { createAction, handleActions, type ActionType } from 'redux-actions';
import { applyPenders, type GenericResponseAction } from 'lib/common';
import * as CommonAPI from 'lib/api/common';
import produce from 'immer';

const GET_TAGS = 'common/GET_TAGS';
const SET_TAG_INFO = 'common/SET_TAG_INFO';
const GET_TAG_INFO = 'common/GET_TAG_INFO';

export type TagData = {
  name: string,
  posts_count: number,
};

export const actionCreators = {
  getTags: createAction(GET_TAGS, CommonAPI.getTags, meta => meta),
  setTagInfo: createAction(SET_TAG_INFO, (info: ?TagData) => info),
  getTagInfo: createAction(GET_TAG_INFO, CommonAPI.getTagInfo),
};

type GetTagsResponseAction = GenericResponseAction<TagData[], string>;
type GetTagInfoResponseAction = GenericResponseAction<TagData, string>;
type SetTagInfoAction = ActionType<typeof actionCreators.setTagInfo>;

export type CommonState = {
  tags: {
    data: ?(TagData[]),
    selected: ?TagData,
    lastParam: ?string,
    sort: string,
  },
};

const initialState: CommonState = {
  tags: {
    data: null,
    selected: null,
    lastParam: null,
    sort: 'popular',
  },
};

const reducer = handleActions(
  {
    [SET_TAG_INFO]: (state, { payload }: SetTagInfoAction) => {
      return produce(state, (draft) => {
        draft.tags.selected = payload;
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
