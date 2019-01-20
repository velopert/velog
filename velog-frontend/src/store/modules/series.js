// @flow
import { createAction, handleActions, type ActionType } from 'redux-actions';
import produce from 'immer';
import { applyPenders, type GenericResponseAction } from 'lib/common';
import * as SeriesAPI from 'lib/api/series';

const GET_SERIES = 'series/GET_SERIES';
const INITIALIZE = 'series/INITIALIZE';
const ENABLE_EDITING = 'series/ENABLE_EDITING';
const DISABLE_EDITING = 'series/DISABLE_EDITING';
const UPDATE_SERIES = 'series/UPDATE_SERIES';
const REMOVE_SERIES = 'seres/REMOVE_SERIES';

export const actionCreators = {
  getSeries: createAction(GET_SERIES, SeriesAPI.getSeries),
  initialize: createAction(INITIALIZE),
  enableEditing: createAction(ENABLE_EDITING),
  disableEditing: createAction(DISABLE_EDITING),
  updateSeries: createAction(UPDATE_SERIES, SeriesAPI.updateSeries),
  removeSeries: createAction(REMOVE_SERIES, SeriesAPI.removeSeries),
};

export type SeriesPostData = {
  index: number,
  id: string,
  thumbnail: ?string,
  title: string,
  released_at: string,
  meta: {
    code_theme: string,
    short_description: string,
  },
  body: string,
  url_slug: string,
};
export type SeriesData = {
  id: string,
  name: string,
  description: string,
  thumbnail: ?string,
  created_at: string,
  updated_at: string,
  user: {
    id: string,
    short_bio: ?string,
    username: string,
    thumbnail: ?string,
  },
  posts: SeriesPostData[],
};

type GetSeriesResponseAction = GenericResponseAction<SeriesData>;

export type SeriesState = {
  series: ?SeriesData,
  editing: boolean,
};

const initialState: SeriesState = {
  series: null,
  editing: false,
};

const reducer = handleActions(
  {
    [INITIALIZE]: () => initialState,
    [ENABLE_EDITING]: state => ({
      ...state,
      editing: true,
    }),
    [DISABLE_EDITING]: state => ({
      ...state,
      editing: false,
    }),
  },
  initialState,
);

export default applyPenders(reducer, [
  {
    type: GET_SERIES,
    onSuccess: (state: SeriesState, { payload }: GetSeriesResponseAction) => {
      return {
        ...state,
        series: payload.data,
      };
    },
  },
]);
