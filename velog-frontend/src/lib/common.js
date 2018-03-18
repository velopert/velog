// @flow
import { pender } from 'redux-pender';

export const pressedEnter = (fn: () => void) => (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    fn();
  }
  return null;
};


export const applyPenders = (reducer: (state: any, action: any) => any, penders: any[]): any => {
  const updaters = Object.assign({}, ...penders.map(pender));
  return (state, action) => {
    if (updaters[action.type]) {
      return updaters[action.type](state, action);
    }
    return reducer(state, action);
  };
};