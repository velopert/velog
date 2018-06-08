// @flow
import { createAction, handleActions, type ActionType } from 'redux-actions';
import moment from 'moment';
import produce from 'immer';
import * as MeAPI from 'lib/api/me';
import * as PostsAPI from 'lib/api/posts';
import { applyPenders } from 'lib/common';

/* ACTION TYPE */
const EDIT_FIELD = 'write/EDIT_FIELD';
const SET_THUMBNAIL = 'write/SET_THUMBNAIL';
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
const UPDATE_POST = 'write/UPDATE_POST';
const RESET = 'write/RESET';
const TEMP_SAVE = 'write/TEMP_SAVE';
const SET_UPLOAD_MASK = 'write/SET_UPLOAD_MASK';
const SET_TEMP_DATA = 'write/SET_TEMP_DATA';
const SET_INSERT_TEXT = 'write/SET_INSERT_TEXT';
const SET_UPLOAD_STATUS = 'write/SET_UPLOAD_STATUS';
const SET_UPLOAD_PROGRESS = 'write/SET_UPLOAD_PROGRESS';
const CREATE_UPLOAD_URL = 'write/CREATE_UPLOAD_URL';

const SHOW_WRITE_EXTRA = 'write/SHOW_WRITE_EXTRA';
const HIDE_WRITE_EXTRA = 'write/HIDE_WRITE_EXTRA';
const SET_LAYOUT_MODE = 'write/SET_LAYOUT_MODE';

const TOGGLE_ADDITIONAL_CONFIG = 'write/TOGGLE_ADDITIONAL_CONFIG';
const SET_META_VALUE = 'write/SET_META_VALUE';
const RESET_META = 'write/RESET_META';

let tempCategoryId = 0;

/* ACTION CREATOR */
type EditFieldPayload = { field: string, value: string };
type ChangeCategoryNamePayload = { id: string, name: string };
type ReorderCategoryPayload = { from: number, to: number };
type SetMetaValuePayload = { name: string, value: string };
/* ACTION CREATORS INTERFACE */
export interface WriteActionCreators {
  editField(payload: EditFieldPayload): any;
  setThumbnail(url: ?string): any;
  openSubmitBox(): any;
  closeSubmitBox(): any;
  listCategories(): any;
  toggleCategory(id: string): any;
  insertTag(tag: string): any;
  removeTag(tag: string): any;
  writePost(payload: PostsAPI.WritePostPayload): any;
  openCategoryModal(): any;
  closeCategoryModal(): any;
  createTempCategory(): any;
  toggleEditCategory(id: string): any;
  changeCategoryName(payload: ChangeCategoryNamePayload): any;
  hideCategory(id: string): any;
  createCategory(name: string, id: string): any;
  deleteCategory(id: string): any;
  updateCategory(payload: MeAPI.UpdateCategoryPayload): any;
  reorderCategory(payload: ReorderCategoryPayload): any;
  reorderCategories(categoryOrders: MeAPI.ReorderCategoryPayload): any;
  updatePost(payload: PostsAPI.UpdatePostPayload): any;
  reset(): any;
  tempSave(payload: PostsAPI.TempSavePayload): any;
  setUploadMask(visible: boolean): any;
  setTempData(): any;
  setInsertText(text: ?string): any;
  setUploadStatus(uploading: boolean): any;
  setUploadProgress(progress: number): any;
  createUploadUrl(payload: PostsAPI.CreateUploadUrlPayload): any;
  showWriteExtra(): any;
  hideWriteExtra(): any;
  setLayoutMode(mode: string): any,
  toggleAdditionalConfig(): any,
  setMetaValue(payload: SetMetaValuePayload): any,
  resetMeta(): any,
}

/* EXPORT ACTION CREATORS */
export const actionCreators = {
  editField: createAction(EDIT_FIELD, (payload: EditFieldPayload) => payload),
  setThumbnail: createAction(SET_THUMBNAIL, (payload: ?string) => payload),
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
    CHANGE_CATEGORY_NAME,
    (payload: ChangeCategoryNamePayload) => payload,
  ),
  hideCategory: createAction(HIDE_CATEGORY, id => id),
  createCategory: createAction(CREATE_CATEGORY, MeAPI.createCategory, (name, id) => id),
  deleteCategory: createAction(DELETE_CATEGORY, MeAPI.deleteCategory),
  updateCategory: createAction(UPDATE_CATEGORY, MeAPI.updateCategory),
  reorderCategory: createAction(REORDER_CATEGORY),
  reorderCategories: createAction(REORDER_CATEGORIES, MeAPI.reorderCategories),
  updatePost: createAction(UPDATE_POST, PostsAPI.updatePost),
  reset: createAction(RESET),
  tempSave: createAction(TEMP_SAVE, PostsAPI.tempSave),
  setUploadMask: createAction(SET_UPLOAD_MASK, (visible: boolean) => visible),
  setTempData: createAction(SET_TEMP_DATA, () => {
    const now = moment().format('LLL');
    const tempText = `${now} 작성됨`;
    return tempText;
  }),
  setInsertText: createAction(SET_INSERT_TEXT, (text: ?string) => text),
  setUploadStatus: createAction(SET_UPLOAD_STATUS, (uploading: boolean) => uploading),
  setUploadProgress: createAction(SET_UPLOAD_PROGRESS, (progress: number) => progress),
  createUploadUrl: createAction(CREATE_UPLOAD_URL, PostsAPI.createUploadUrl),
  showWriteExtra: createAction(SHOW_WRITE_EXTRA),
  hideWriteExtra: createAction(HIDE_WRITE_EXTRA),
  setLayoutMode: createAction(SET_LAYOUT_MODE),
  toggleAdditionalConfig: createAction(TOGGLE_ADDITIONAL_CONFIG),
  setMetaValue: createAction(SET_META_VALUE, (payload: SetMetaValuePayload) => payload),
  resetMeta: createAction(RESET_META),
};

/* ACTION FLOW TYPE */
type EditFieldAction = ActionType<typeof actionCreators.editField>;
type SetThumbnailAction = ActionType<typeof actionCreators.setThumbnail>;
type ToggleCategoryAction = ActionType<typeof actionCreators.toggleCategory>;
type InsertTagAction = ActionType<typeof actionCreators.insertTag>;
type RemovetagAction = ActionType<typeof actionCreators.removeTag>;
type ToggleEditCategoryAction = ActionType<typeof actionCreators.toggleEditCategory>;
type ChangeCategoryNameAction = ActionType<typeof actionCreators.changeCategoryName>;
type HideCategoryAction = ActionType<typeof actionCreators.hideCategory>;
type ReorderCategoryAction = ActionType<typeof actionCreators.reorderCategory>;
type SetUploadMaskAction = ActionType<typeof actionCreators.setUploadMask>;
type SetTempDataAction = ActionType<typeof actionCreators.setTempData>;
type SetMetaValueAction = ActionType<typeof actionCreators.setMetaValue>;
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
};
export type Categories = Category[];
export type SubmitBox = {
  open: boolean,
  tags: string[],
  categories: ?Categories,
  additional: boolean,
};
export type CategoryModal = {
  open: boolean,
  categories: ?Categories,
  ordered: boolean,
};

export type Meta = {
  code_theme?: string,
  short_description?: ?string,
}
export type PostData = {
  id: string,
  title: string,
  body: string,
  thumbnail: string,
  is_markdown: boolean,
  is_temp: boolean,
  created_at: string,
  updated_at: string,
  tags: string[],
  categories: { id: string, name: string }[],
  url_slug: string,
  meta: Meta,
};

export type Upload = {
  mask: boolean,
  uploading: boolean,
  progress: number,
  uploadUrl: ?string,
  id: ?string,
  imagePath: ?string,
};

export type LayoutMode = 'editor' | 'both' | 'preview';

export type WriteExtra = {
  visible: boolean,
  layoutMode: LayoutMode,
};

export type Write = {
  body: string,
  title: string,
  thumbnail: ?string,
  meta: Meta,
  submitBox: SubmitBox,
  postData: ?PostData,
  categoryModal: CategoryModal,
  upload: Upload,
  insertText: ?string,
  writeExtra: WriteExtra
};

const initialState: Write = {
  body: '',
  thumbnail: null,
  title: '',
  meta: {
    code_theme: '',
    short_description: null,
  },
  submitBox: {
    open: false,
    categories: null,
    tags: [],
    additional: false,
  },
  postData: null,
  categoryModal: {
    open: false,
    categories: null,
    ordered: false,
  },
  upload: {
    mask: false,
    uploading: false,
    progress: 0,
    uploadUrl: null,
    imagePath: null,
    id: null,
  },
  writeExtra: {
    visible: false,
    layoutMode: 'both',
  },
  insertText: null,
};

const reducer = handleActions(
  {
    [EDIT_FIELD]: (state, { payload }: EditFieldAction) => {
      const { field, value } = payload;
      return produce(state, (draft) => {
        draft[field] = value;
      });
    },
    [SET_THUMBNAIL]: (state, { payload }: SetThumbnailAction) => {
      return produce(state, (draft) => {
        draft.thumbnail = payload;
      });
    },
    [OPEN_SUBMIT_BOX]: (state) => {
      return produce(state, (draft) => {
        draft.submitBox.open = true;
        draft.submitBox.additional = false;
      });
    },
    [CLOSE_SUBMIT_BOX]: state =>
      produce(state, (draft) => {
        draft.submitBox.open = false;
      }),
    [TOGGLE_CATEGORY]: (state, { payload: id }: ToggleCategoryAction) => {
      if (!state.submitBox.categories) return state;
      const index = state.submitBox.categories.findIndex(category => category.id === id);
      return produce(state, (draft) => {
        if (!draft.submitBox.categories) return;
        draft.submitBox.categories[index].active = !draft.submitBox.categories[index].active;
      });
    },
    [INSERT_TAG]: (state, { payload: tag }: InsertTagAction) => {
      return produce(state, (draft) => {
        draft.submitBox.tags.push(tag);
      });
    },
    [REMOVE_TAG]: (state, { payload: tag }: RemovetagAction) => {
      return produce(state, (draft) => {
        draft.submitBox.tags = draft.submitBox.tags.filter(t => t !== tag);
      });
    },
    [OPEN_CATEGORY_MODAL]: (state) => {
      return produce(state, (draft) => {
        draft.categoryModal.open = true;
        draft.categoryModal.categories = state.submitBox.categories;
        draft.categoryModal.ordered = false;
      });
    },
    [CLOSE_CATEGORY_MODAL]: (state) => {
      return produce(state, (draft) => {
        draft.categoryModal.open = false;
      });
    },
    [CREATE_TEMP_CATEGORY]: (state) => {
      return produce(state, (draft) => {
        tempCategoryId += 1;
        const tempCategory: Category = {
          id: tempCategoryId.toString(),
          order: 0,
          parent: '',
          private: false,
          name: '',
          urlSlug: '',
          active: false,
          edit: true,
          temp: true,
          edited: false,
          hide: false,
        };
        if (!draft.categoryModal.categories) return;
        draft.categoryModal.categories.push(tempCategory);
      });
    },
    [TOGGLE_EDIT_CATEGORY]: (state, { payload: id }: ToggleEditCategoryAction) => {
      if (!state.categoryModal.categories) return state;
      const index = state.categoryModal.categories.findIndex(c => c.id === id);
      return produce(state, (draft) => {
        if (!draft.categoryModal.categories) return;
        const category = draft.categoryModal.categories[index];
        category.edit = !category.edit;
        category.edited = true;
      });
    },
    [CHANGE_CATEGORY_NAME]: (state, { payload: { id, name } }: ChangeCategoryNameAction) => {
      if (!state.categoryModal.categories) return state;
      const index = state.categoryModal.categories.findIndex(c => c.id === id);
      return produce(state, (draft) => {
        if (!draft.categoryModal.categories) return;
        draft.categoryModal.categories[index].name = name;
      });
    },
    [HIDE_CATEGORY]: (state, { payload: id }: HideCategoryAction) => {
      if (!state.categoryModal.categories) return state;
      const index = state.categoryModal.categories.findIndex(c => c.id === id);
      return produce(state, (draft) => {
        if (!draft.categoryModal.categories) return;
        draft.categoryModal.categories[index].hide = true;
      });
    },
    [REORDER_CATEGORY]: (state, { payload: { from, to } }: ReorderCategoryAction) => {
      if (!state.categoryModal.categories) return state;
      const fromItem = state.categoryModal.categories[from];
      return produce(state, (draft) => {
        if (!draft.categoryModal.categories) return;
        draft.categoryModal.categories.splice(from, 1);

        if (!draft.categoryModal.categories) return;
        draft.categoryModal.categories.splice(to, 0, fromItem);
        draft.categoryModal.ordered = true;
      });
    },
    [RESET]: () => {
      // resets the state (when leaves write page)
      return initialState;
    },
    [SET_UPLOAD_MASK]: (state, { payload: visible }: SetUploadMaskAction) => {
      return produce(state, (draft) => {
        draft.upload.mask = visible;
      });
    },
    [SET_TEMP_DATA]: (state, action: SetTempDataAction) => {
      return produce(state, (draft) => {
        if (state.body === '') {
          draft.body = action.payload;
        }
        if (state.title === '') {
          draft.title = action.payload;
        }
      });
    },
    [SET_INSERT_TEXT]: (state, action) => {
      return produce(state, (draft) => {
        draft.insertText = action.payload;
      });
    },
    [SET_UPLOAD_STATUS]: (state, action) => {
      return produce(state, (draft) => {
        draft.upload.uploading = action.payload;
      });
    },
    [SET_UPLOAD_PROGRESS]: (state, action) => {
      return produce(state, (draft) => {
        draft.upload.progress = action.payload;
      });
    },
    [SHOW_WRITE_EXTRA]: (state, action) => {
      return produce(state, (draft) => {
        draft.writeExtra.visible = true;
      });
    },
    [HIDE_WRITE_EXTRA]: (state) => {
      return produce(state, (draft) => {
        draft.writeExtra.visible = false;
      });
    },
    [SET_LAYOUT_MODE]: (state, action) => {
      return produce(state, (draft) => {
        draft.writeExtra.layoutMode = action.payload;
      });
    },
    [TOGGLE_ADDITIONAL_CONFIG]: (state) => {
      return produce(state, (draft) => {
        draft.submitBox.additional = !state.submitBox.additional;
      });
    },
    [SET_META_VALUE]: (state, { payload }: SetMetaValueAction) => {
      return produce(state, (draft) => {
        draft.meta[payload.name] = payload.value;
      });
    },
    [RESET_META]: (state) => {
      return {
        ...state,
        meta: initialState.meta,
      };
    },
  },
  initialState,
);

export default applyPenders(reducer, [
  {
    type: LIST_CATEGORIES,
    onSuccess: (state: Write, { payload: { data } }) => {
      const categories: Categories = data.map(category => ({
        id: category.id,
        order: category.order,
        parent: category.parent,
        private: category.private,
        name: category.name,
        urlSlug: category.url_slug,
      }));
      return produce(state, (draft) => {
        draft.submitBox.categories = categories;
        // turn on active categories (created post)
        if (state.postData) {
          const categoryIds = state.postData.categories.map(c => c.id);
          if (!draft.submitBox.categories) return;
          draft.submitBox.categories = draft.submitBox.categories.map(c => ({
            ...c,
            active: categoryIds.indexOf(c.id) !== -1,
          }));
        }
        // existing active categories
        if (state.submitBox.categories && state.submitBox.categories.length > 0) {
          const categoryIds = state.submitBox.categories.filter(c => c.active).map(c => c.id);
          if (!draft.submitBox.categories) return;
          draft.submitBox.categories = draft.submitBox.categories.map(
            c => (categoryIds.indexOf(c.id) !== -1 ? { ...c, active: true } : c),
          );
        }
      });
    },
  },
  {
    type: WRITE_POST,
    onSuccess: (state: Write, { payload: { data } }) => {
      return produce(state, (draft) => {
        draft.postData = data;
      });
    },
  },
  {
    type: CREATE_CATEGORY,
    onSuccess: (state: Write, action) => {
      const { payload, meta } = action;
      if (!state.categoryModal.categories) return state;
      const index = state.categoryModal.categories.findIndex(c => c.id === meta);
      return produce(state, (draft) => {
        if (!draft.categoryModal.categories) return;
        draft.categoryModal.categories[index].id = payload.data.id;
      });
    },
  },
  {
    type: UPDATE_POST,
    onSuccess: (state: Write, { payload: { data } }) => {
      return produce(state, (draft) => {
        draft.postData = data;
      });
    },
  },
  {
    type: CREATE_UPLOAD_URL,
    onSuccess: (state: Write, { payload: { data } }) => {
      return produce(state, (draft) => {
        draft.upload.uploadUrl = data.url;
        draft.upload.imagePath = data.imagePath;
        draft.upload.id = data.id;
      });
    },
  },
]);
