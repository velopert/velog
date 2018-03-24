// @flow
import { pender } from 'redux-pender';
import type { $AxiosXHR, $AxiosError } from 'axios';

export const pressedEnter = (fn: () => void) => (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    fn();
  }
  return null;
};

type Reducer = (state: any, action: any) => any;

export function applyPenders<T: Reducer>(
  reducer: T,
  penders: any[],
): T {
  const updaters = Object.assign({}, ...penders.map(pender));
  return (((state, action) => {
    if (updaters[action.type]) {
      return updaters[action.type](state, action);
    }
    return reducer(state, action);
  }): any);
}

export type ResponseAction = {
  type: string,
  payload: $AxiosXHR<*>,
  error: $AxiosError<*>
};