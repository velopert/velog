// @flow
import { createAction, handleActions } from 'redux-actions';
import { Record, fromJS, List, Set, type Map } from 'immutable';
import * as MeAPI from 'lib/api/me';
import * as PostsAPI from 'lib/api/posts';
import { pender } from 'redux-pender';

const EDIT_FIELD = 'write/EDIT_FIELD';
const OPEN_SUBMIT_BOX = 'write/OPEN_SUBMIT_BOX';
const CLOSE_SUBMIT_BOX = 'write/CLOSE_SUBMIT_BOX';
const LIST_CATEGORIES = 'write/LIST_CATEGORIES';
const TOGGLE_CATEGORY = 'write/TOGGLE_CATEGORY';
const INSERT_TAG = 'write/INSERT_TAG';
const REMOVE_TAG = 'write/REMOVE_TAG';
const WRITE_POST = 'write/WRITE_POST';
const OPEN_CATEGORY_MODAL = 'write/OPEN_CATEGORY_MODAL';
const CLOSE_CATEGORY_MODAL = 'write/CLOSE_CATEOGRY_MODAL';
const CREATE_TEMP_CATEGORY = 'write/CREATE_TEMP_CATEGORY';
const TOGGLE_EDIT_CATEGORY = 'write/TOGGLE_EDIT_CATEGORY';
const CHANGE_CATEGORY_NAME = 'write/CHANGE_CATEGORY_NAME';
const HIDE_CATEGORY = 'write/HIDE_CATEGORY';
const CREATE_CATEGORY = 'write/CREATE_CATEGORY';
const DELETE_CATEGORY = 'write/DELETE_CATERGORY';
const UPDATE_CATEGORY = 'write/UPDATE_CATEGORY';

let tempCategoryId = 0;

export type WriteActionCreators = {
  editField({field: string, value: string}): any,
  openSubmitBox(): any,
  closeSubmitBox(): any,
  listCategories(): any,
  toggleCategory(id: string): any,
  insertTag(tag: string): any,
  removeTag(tag: string): any,
  writePost(payload: PostsAPI.WritePostPayload): any,
  openCategoryModal(): any,
  closeCategoryModal(): any,
  createTempCategory(): any,
  toggleEditCategory(id: string): any,
  changeCategoryName({ id: string, name: string }): any,
  hideCategory(id: string): any,
  createCategory(name: string): any,
  deleteCategory(id: string): any,
  updateCategory({ id: string, name: string }): any,
};

export const actionCreators = {
  editField: createAction(EDIT_FIELD),
  openSubmitBox: createAction(OPEN_SUBMIT_BOX),
  closeSubmitBox: createAction(CLOSE_SUBMIT_BOX),
  listCategories: createAction(LIST_CATEGORIES, MeAPI.listCategories),
  toggleCategory: createAction(TOGGLE_CATEGORY, id => id),
  insertTag: createAction(INSERT_TAG, tag => tag),
  removeTag: createAction(REMOVE_TAG, tag => tag),
  writePost: createAction(WRITE_POST, PostsAPI.writePost),
  openCategoryModal: createAction(OPEN_CATEGORY_MODAL),
  closeCategoryModal: createAction(CLOSE_CATEGORY_MODAL),
  createTempCategory: createAction(CREATE_TEMP_CATEGORY),
  toggleEditCategory: createAction(TOGGLE_EDIT_CATEGORY, id => id),
  changeCategoryName: createAction(CHANGE_CATEGORY_NAME, ({ id, name }) => ({ id, name })),
  hideCategory: createAction(HIDE_CATEGORY, id => id),
  createCategory: createAction(CREATE_CATEGORY, MeAPI.createCategory),
  deleteCategory: createAction(DELETE_CATEGORY, MeAPI.deleteCategory),
  updateCategory: createAction(UPDATE_CATEGORY, MeAPI.updateCategory),
};

export type Category = {
  id: string,
  order: number,
  parent: string,
  private: boolean,
  name: string,
  urlSlug: string,
  active: boolean,
  temp?: boolean,
  edit?: boolean,
  hide?: boolean,
  edited?: boolean,
}

export type Categories = List<Category>;

export type SubmitBox = {
  open: boolean,
  tags: List<string>,
  categories: ?Categories
};

export type CategoryModal = {
  open: boolean,
  categories: ?Categories,
}

export type PostData = {
  id: string,
  title: string,
  body: string,
  thumbnail: string,
  is_markdown: boolean,
  created_at: string,
  updated_at: string,
  tags: Array<string>,
  categories: Array<{ id: string, name: string }>,
  url_slug: string
};

export type Write = {
  body: string,
  title: string,
  submitBox: SubmitBox,
  postData: ?PostData,
  categoryModal: CategoryModal,
};


const SubmitBoxSubrecord = Record({
  open: false,
  categories: null,
  tags: List([]),
});

const CategoryModalSubrecord = Record({
  open: false,
  categories: null,
});


const CategorySubrecord = Record({
  id: '',
  order: 0,
  parent: null,
  private: false,
  name: '',
  urlSlug: '',
  active: false,
  edit: false,
  temp: false,
  edited: false,
  hide: false,
});

const WriteRecord = Record({
  body: '',
  title: '',
  submitBox: SubmitBoxSubrecord(),
  postData: null,
  categoryModal: CategoryModalSubrecord(),
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
      return state.setIn(['submitBox', 'categories'], List(categories));
    },
  }),
  [TOGGLE_CATEGORY]: (state, { payload: id }) => {
    const index = state.submitBox.categories.findIndex(category => category.id === id);
    return state.updateIn(['submitBox', 'categories', index, 'active'], active => !active);
  },
  [INSERT_TAG]: (state, { payload: tag }) => state.updateIn(['submitBox', 'tags'], tags => tags.concat(tag)),
  [REMOVE_TAG]: (state, { payload: tag }) => state.updateIn(
    ['submitBox', 'tags'],
    tags => tags.filter(t => tag !== t),
  ),
  ...pender({
    type: WRITE_POST,
    onSuccess: (state, { payload: response }) => state.set('postData', response.data),
  }),
  [OPEN_CATEGORY_MODAL]: state => state.withMutations(
    s => s.setIn(['categoryModal', 'open'], true)
      .setIn(
        ['categoryModal', 'categories'],
        state.getIn(['submitBox', 'categories']),
      ),
  ),
  [CLOSE_CATEGORY_MODAL]: state => state.setIn(['categoryModal', 'open'], false),
  [CREATE_TEMP_CATEGORY]: state => state.updateIn(
    ['categoryModal', 'categories'],
    (categories) => {
      tempCategoryId += 1;
      return categories.push(CategorySubrecord({
        id: tempCategoryId,
        name: '',
        edit: true,
        temp: true,
      }));
    },
  ),
  [TOGGLE_EDIT_CATEGORY]: (state, { payload: id }) => {
    const index = state.categoryModal.categories.findIndex(
      c => c.id === id,
    );

    return state.updateIn(
      ['categoryModal', 'categories', index],
      category => category.withMutations(
        c => c.update('edit', edit => !edit)
          .set('edited', true),
      ),
    );
  },
  [CHANGE_CATEGORY_NAME]: (state, { payload: { id, name } }) => {
    const index = state.categoryModal.categories.findIndex(
      c => c.id === id,
    );
    return state.setIn(
      ['categoryModal', 'categories', index, 'name'],
      name,
    );
  },
  [HIDE_CATEGORY]: (state, { payload: id }) => {
    const index = state.categoryModal.categories.findIndex(
      c => c.id === id,
    );
    return state.setIn(
      ['categoryModal', 'categories', index, 'hide'],
      true,
    );
  },
}, initialState);
