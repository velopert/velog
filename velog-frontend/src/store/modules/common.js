// @flow
import { createAction, handleActions, type ActionType } from 'redux-actions';
import { applyPenders, type GenericResponseAction } from 'lib/common';
import * as CommonAPI from 'lib/api/common';
import produce from 'immer';

const GET_TAGS = 'common/GET_TAGS';

export const actionCreators = {
  getTags: createAction(GET_TAGS, CommonAPI.getTags),
};

export type TagData = {
  name: string,
  posts_count: number,
};

type GetTagsResponseAction = GenericResponseAction<TagData[], string>;

export type CommonState = {
  tags: {
    data: ?(TagData[]),
  },
};

const initialState = {
  tags: {
    data: null,
  },
};

const reducer = handleActions({}, initialState);

export default applyPenders(reducer, [
  {
    type: GET_TAGS,
    onSuccess: (state: CommonState, { payload }: GetTagsResponseAction) => {
      return produce(state, (draft) => {
        if (draft) {
          draft.tags.data = payload.data;
        }
      });
    },
  },
]);
