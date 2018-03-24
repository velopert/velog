// @flow
import { createAction, handleActions, type ActionType } from 'redux-actions';
import produce from 'immer';
import * as MeAPI from 'lib/api/me';
import * as PostsAPI from 'lib/api/posts';
import { applyPenders } from 'lib/common';


/* ACTION TYPE */
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
const REORDER_CATEGORY = 'write/REORDER_CATEGORY';
const REORDER_CATEGORIES = 'write/REORDER_CATEGORIES';


let tempCategoryId = 0;

/* ACTION CREATOR */
type EditFieldPayload = { field: string, value: string };
type ChangeCategoryNamePayload = { id: string, name: string };
type ReorderCategoryPayload = { from: string, to: string };


/* ACTION CREATORS INTERFACE */
export interface WriteActionCreators {
  editField(payload: EditFieldPayload): any,
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
  changeCategoryName(payload: ChangeCategoryNamePayload): any,
  hideCategory(id: string): any,
  createCategory(name: string, id: string): any,
  deleteCategory(id: string): any,
  updateCategory(payload: MeAPI.UpdateCategoryPayload): any,
  reorderCategory(payload: ReorderCategoryPayload): any,
  reorderCategories(categoryOrders: MeAPI.ReorderCategoryPayload): any
}

const editField = createAction(EDIT_FIELD, (payload: EditFieldPayload) => payload);

/* EXPORT ACTION CREATORS */
export const actionCreators = {
  editField: createAction(EDIT_FIELD, (payload: EditFieldPayload) => payload),
  openSubmitBox: createAction(OPEN_SUBMIT_BOX),
  closeSubmitBox: createAction(CLOSE_SUBMIT_BOX),
  listCategories: createAction(LIST_CATEGORIES, MeAPI.listCategories),
  toggleCategory: createAction(TOGGLE_CATEGORY, (id: string) => id),
  insertTag: createAction(INSERT_TAG, (tag: string) => tag),
  removeTag: createAction(REMOVE_TAG, (tag: string) => tag),
  writePost: createAction(WRITE_POST, PostsAPI.writePost),
  openCategoryModal: createAction(OPEN_CATEGORY_MODAL),
  closeCategoryModal: createAction(CLOSE_CATEGORY_MODAL),
  createTempCategory: createAction(CREATE_TEMP_CATEGORY),
  toggleEditCategory: createAction(TOGGLE_EDIT_CATEGORY, id => id),
  changeCategoryName: createAction(
    CHANGE_CATEGORY_NAME, (payload: ChangeCategoryNamePayload) => payload),
  hideCategory: createAction(HIDE_CATEGORY, id => id),
  createCategory: createAction(CREATE_CATEGORY, MeAPI.createCategory, (name, id) => id),
  deleteCategory: createAction(DELETE_CATEGORY, MeAPI.deleteCategory),
  updateCategory: createAction(UPDATE_CATEGORY, MeAPI.updateCategory),
  reorderCategory: createAction(REORDER_CATEGORY),
  reorderCategories: createAction(REORDER_CATEGORIES, MeAPI.reorderCategories),
};

/* ACTION FLOW TYPE */
type EditFieldAction = ActionType<typeof editField>;

type ToggleCategoryAction = ActionType<typeof actionCreators.toggleCategory>;
type InsertTagAction = ActionType<typeof actionCreators.insertTag>;
type RemovetagAction = ActionType<typeof actionCreators.removeTag>;
type ToggleEditCategoryAction = ActionType<typeof actionCreators.toggleEditCategory>;
type ChangeCategoryNameAction = ActionType<typeof actionCreators.changeCategoryName>;
type HideCategoryAction = ActionType<typeof actionCreators.hideCategory>;

/* STATE TYPES */
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
export type Categories = Category[];
export type SubmitBox = {
  open: boolean,
  tags: string[],
  categories: ?Categories
};
export type CategoryModal = {
  open: boolean,
  categories: ?Categories,
  ordered: boolean
};
export type PostData = {
  id: string,
  title: string,
  body: string,
  thumbnail: string,
  is_markdown: boolean,
  created_at: string,
  updated_at: string,
  tags: string[],
  categories: { id: string, name: string }[],
  url_slug: string
};
export type Write = {
  body: string,
  title: string,
  submitBox: SubmitBox,
  postData: ?PostData,
  categoryModal: CategoryModal,
};

const initialState: Write = {
  body: '',
  title: '',
  submitBox: {
    open: false,
    categories: null,
    tags: [],
  },
  postData: null,
  categoryModal: {
    open: false,
    categories: null,
    ordered: false,
  },
};

const reducer = handleActions({
  [EDIT_FIELD]: (state, { payload }: EditFieldAction) => {
    const { field, value } = payload;
    return produce(state, (draft) => {
      draft[field] = value;
    });
  },
}, initialState);

// export type Counter = {
//   value: number
// };

// /* INITIAL STATE */
// const initialState: Counter = {
//   value: 0
// };

// /* REDUCER */
// export default handleActions({
//   [INCREASE]: (state, action: increaseAction) => {
//     return produce(state, draft => {
//       draft.value += 1;
//     });
//   }
// }, initialState);