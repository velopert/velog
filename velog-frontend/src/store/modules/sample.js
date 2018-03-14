// @flow
import { createAction, handleActions, type ActionType } from 'redux-actions';
import produce from 'immer';

/* ACTION TYPES */
const PLAIN = 'sample/PLAIN';
const INCREASE = 'sample/INCREASE';
const INSERT = 'sample/INSERT';
const CHANGE = 'sample/CHANGE';

/* ACTION PAYLOADS */
type InsertPayload = {
  id: number,
  text: string
}

/* ACTION CREATORS */
const plain = createAction(PLAIN);
const increase = createAction(INCREASE, (value: number) => value);
const insert = createAction(INSERT, ({ id, text }: InsertPayload): InsertPayload => ({ id, text }));
const change = createAction(CHANGE, (text: string) => text);

/* ACTION FLOW TYPES */
type PlainAction = ActionType<typeof plain>;
type IncreaseAction = ActionType<typeof increase>;
type InsertAction = ActionType<typeof insert>;
type ChangeAction = ActionType<typeof change>;

/* EXPORTING ACTION CREATORS / ACTION CREATORS TYPES */
export interface SampleActionCreators {
  plain(): PlainAction,
  increase(value: number): IncreaseAction,
  insert(payload: InsertPayload): InsertAction,
  change(text: string): ChangeAction,
}

export const actionCreators: SampleActionCreators = {
  plain, increase, insert, change,
};

/* State Types */
type TodoItem = {
  id: number,
  text: string,
  done: boolean
};

export type Sample = {
  value: number,
  text: string,
  todos: TodoItem[],
}

const initialState: Sample = {
  value: 0,
  text: '',
  todos: [],
};

const reducer = handleActions({
  [PLAIN]: (state, action: PlainAction) => state,
  [INCREASE]: (state, action: IncreaseAction) => {
    return produce(state, (draft) => {
      if (!action || !draft) return;
      draft.value = action.payload;
    });
  },
  [INSERT]: (state, action: InsertAction) => {
    return produce(state, (draft) => {
      if (!action || !draft) return;
      draft.todos.push({ ...action.payload, done: false });
    });
  },
  [CHANGE]: (state, action: ChangeAction) => {
    return produce(state, (draft) => {
      if (!action || !draft) return;
      draft.text = action.payload;
    });
  },
}, initialState);

export default reducer;