// @flow
import { createAction, handleActions } from 'redux-actions';
import { Record, fromJS, List, type Map } from 'immutable';
import * as MeAPI from 'lib/api/me';
import { pender } from 'redux-pender';

const EDIT_FIELD = 'write/EDIT_FIELD';
const OPEN_SUBMIT_BOX = 'write/OPEN_SUBMIT_BOX';
const CLOSE_SUBMIT_BOX = 'write/CLOSE_SUBMIT_BOX';
const LIST_CATEGORIES = 'user/LIST_CATEGORIES';
const TOGGLE_CATEGORY = 'user/TOGGLE_CATEGORY';

export type WriteActionCreators = {
  editField({field: string, value: string}): any,
  openSubmitBox(): any,
  closeSubmitBox(): any,
  listCategories(): any,
  toggleCategory(id: string): any,
};

export const actionCreators = {
  editField: createAction(EDIT_FIELD),
  openSubmitBox: createAction(OPEN_SUBMIT_BOX),
  closeSubmitBox: createAction(CLOSE_SUBMIT_BOX),
  listCategories: createAction(LIST_CATEGORIES, MeAPI.listCategories),
  toggleCategory: createAction(TOGGLE_CATEGORY, id => id),
};

export type Category = {
  id: string,
  order: number,
  parent: string,
  private: boolean,
  name: string,
  urlSlug: string,
  active: boolean,
}

export type Categories = List<Category>;

export type SubmitBox = {
  open: boolean
};

export type Write = {
  body: string,
  title: string,
  submitBox: SubmitBox,
  categories: ?Categories,
};

const SubmitBoxSubrecord = Record({
  open: false,
});

const CategorySubrecord = Record({
  id: '',
  order: 0,
  parent: null,
  private: false,
  name: '',
  urlSlug: '',
  active: false,
});

const WriteRecord = Record({
  body: '',
  title: '',
  submitBox: SubmitBoxSubrecord(),
  categories: null,
});

const initialState: Map<string, *> = WriteRecord();

export default handleActions({
  [EDIT_FIELD]: (state, { payload: { field, value } }) => state.set(field, value),
  [OPEN_SUBMIT_BOX]: state => state.setIn(['submitBox', 'open'], true),
  [CLOSE_SUBMIT_BOX]: state => state.setIn(['submitBox', 'open'], false),
  ...pender({
    type: LIST_CATEGORIES,
    onSuccess: (state, { payload: { data } }) => {
      const categories = data.map(category => CategorySubrecord({
        id: category.id,
        order: category.order,
        parent: category.parent,
        private: category.private,
        name: category.name,
        urlSlug: category.url_slug,
      }));
      return state.set('categories', List(categories));
    },
  }),
  [TOGGLE_CATEGORY]: (state, { payload: id }) => {
    const index = state.categories.findIndex(category => category.id === id);
    return state.updateIn(['categories', index, 'active'], active => !active);
  },
}, initialState);