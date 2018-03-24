// @flow
import invariant from 'invariant';
import auth, { actionCreators, type Auth, AuthActionCreators } from '../auth';

describe('auth', () => {
  describe('reducer', () => {
    let state: Auth = auth((undefined: any), ({}: any));

    it('initializes state', () => {
      expect(state).toMatchSnapshot();
    });
  });
});