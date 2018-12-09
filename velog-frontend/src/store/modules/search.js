// @flow
import * as SearchAPI from 'lib/api/search';
import { createAction, handleActions } from 'redux-actions';
import { applyPenders } from 'redux-pender';
import { type GenericResponseAction } from 'lib/common';
import produce from 'immer';
import { type PostItem } from './listing';

const PUBLIC_SEARCH = 'search/PUBLIC_SEARCH';
const INITIALIZE = 'search/INITIALIZE';

export const actionCreators = {
  publicSearch: createAction(
    PUBLIC_SEARCH,
    SearchAPI.search,
    (meta: SearchAPI.SearchParams) => meta,
  ),
};

type PublicSearchPending = {
  type: string,
  meta: SearchAPI.SearchParams,
};

type PublicSearchResponse = GenericResponseAction<
  {
    count: number,
    data: PostItem[],
  },
  void,
>;

export type SearchState = {
  result: ?{
    count: number,
    data: PostItem[],
  },
  currentPage: number,
  currentKeyword: string,
};

const initialState = {
  result: null,
  currentPage: 1,
  currentKeyword: '',
};

const reducer = handleActions(
  {
    [INITIALIZE]: () => initialState,
  },
  initialState,
);

export default applyPenders(reducer, [
  {
    type: PUBLIC_SEARCH,
    onPending: (state: SearchState, action: PublicSearchPending) => {
      const { meta } = action;
      return produce(state, (draft) => {
        draft.currentPage = 1;
        draft.currentKeyword = meta.q;
      });
    },
    onSuccess: (state: SearchState, action: PublicSearchResponse) => {
      return {
        ...state,
        result: action.payload.data,
      };
    },
  },
]);
