// // @flow
// import invariant from 'invariant';
// import base, { actionCreators, type Base, BaseActionCreators } from '../base';


// describe('base', () => {
//   describe('reducer', () => {
//     let state: Base = base((undefined: any), ({}: any));

//     it('initializes state', () => {
//       expect(state).toMatchSnapshot();
//     });
//     it('action: SHOW_USER_MENU', () => {
//       if (!state) return;
//       state = base(state, actionCreators.showUserMenu());
//     });
//     it('action: HIDE_USER_MENU', () => {
//       if (!state) return;
//       state = base(state, actionCreators.hideUserMenu());
//     });
//     it('action: ', () => {
//       if (!state) return;
//       state = base(state, actionCreators.setFullscreenLoader(true));
//     });
//   });
// });