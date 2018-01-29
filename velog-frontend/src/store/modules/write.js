// @flow
import { createAction, handleActions } from 'redux-actions';
import { Record, fromJS, type Map } from 'immutable';

const EDIT_FIELD = 'EDIT_FIELD';

export type WriteActionCreators = {
  editField({field: string, value: string}): any
};

export const actionCreators = {
  editField: createAction(EDIT_FIELD),
};

export type Write = {
  body: string,
  title: string,
};

const WriteRecord = Record({
  body: '',
  title: '',
});

const initialState: Map<string, *> = WriteRecord();

export default handleActions({
  [EDIT_FIELD]: (state, { payload: { field, value } }) => state.set(field, value),
}, initialState);