// @flow
import { createAction, handleActions } from 'redux-actions';
import { Record, fromJS, type Map } from 'immutable';

const EDIT_BODY = 'EDIT_BODY';
const EDIT_FIELD = 'EDIT_FIELD';

export type WriteActionCreators = {
  editBody(value: string): any,
  editField({field: string, value: string}): any
};

export const actionCreators = {
  editBody: createAction(EDIT_BODY),
};

export type Write = {
  body: string
};

const WriteRecord = Record({
  body: '',
});

const initialState: Map<string, *> = WriteRecord();

export default handleActions({
  [EDIT_BODY]: (state, { payload: value }) => state.set('body', value),
}, initialState);