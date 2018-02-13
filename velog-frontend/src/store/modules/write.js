// @flow
import { createAction, handleActions } from 'redux-actions';
import { Record, fromJS, type Map } from 'immutable';

const EDIT_FIELD = 'write/EDIT_FIELD';
const OPEN_SUBMIT_BOX = 'write/OPEN_SUBMIT_BOX';
const CLOSE_SUBMIT_BOX = 'write/CLOSE_SUBMIT_BOX';

export type WriteActionCreators = {
  editField({field: string, value: string}): any,
  openSubmitBox(): any,
  closeSubmitBox(): any,
};

export const actionCreators = {
  editField: createAction(EDIT_FIELD),
  openSubmitBox: createAction(OPEN_SUBMIT_BOX),
  closeSubmitBox: createAction(CLOSE_SUBMIT_BOX),
};


export type SubmitBox = {
  open: boolean
};

export type Write = {
  body: string,
  title: string,
  submitBox: SubmitBox,
};

const SubmitBoxSubrecord = Record({
  open: false,
});

const WriteRecord = Record({
  body: '',
  title: '',
  submitBox: SubmitBoxSubrecord(),
});

const initialState: Map<string, *> = WriteRecord();

export default handleActions({
  [EDIT_FIELD]: (state, { payload: { field, value } }) => state.set(field, value),
  [OPEN_SUBMIT_BOX]: state => state.setIn(['submitBox', 'open'], true),
  [CLOSE_SUBMIT_BOX]: state => state.setIn(['submitBox', 'open'], false),
}, initialState);