// @flow
import configure from './configure';
import type { Auth } from './modules/auth';

const store = configure();

export default store;

export type State = {
  auth: Auth,
  pender: {
    pending: any,
    success: any,
    failure: any
  }
};
