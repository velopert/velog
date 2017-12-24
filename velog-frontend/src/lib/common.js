// @flow
export const pressedEnter = (fn: () => void) => (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    fn();
  }
  return null;
};
