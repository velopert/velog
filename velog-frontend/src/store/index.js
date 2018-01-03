// @flow
import configure from './configure';
import type { Auth } from './modules/auth';
import type { User } from './modules/user';

const store = configure();

export default store;

export type State = {
  auth: Auth,
  user: User,
  pender: {
    pending: any,
    success: any,
    failure: any
  }
};
