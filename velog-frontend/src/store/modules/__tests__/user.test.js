// @flow
import user, { actionCreators, type User, UserActionCreators } from '../user';

describe('user', () => {
  describe('reducer', () => {
    let state: User = user((undefined: any), ({}: any));

    it('initializes state', () => {
      expect(state).toMatchSnapshot();
    });
    // TODO: test checkUser
    it('action: SET_USER', () => {
      const sampleUser = {
        id: 'id',
        username: 'velopert',
        displayName: 'velopert',
        thumbnail: 'asdf',
      };
      state = user(state, actionCreators.setUser(sampleUser));
      expect(state.user).toBe(sampleUser);
    });
    it('action: PROCESS_USER', () => {
      state = user(state, actionCreators.processUser());
      expect(state.processed).toBeTruthy();
    });
  });
});