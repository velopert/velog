// @flow
import configure from './configure';
import type { Auth } from './modules/auth';
import type { User } from './modules/user';
import type { Base } from './modules/base';

const store = configure();

export default store;

export type State = {
  auth: Auth,
  user: User,
  base: Base,
  pender: {
    pending: any,
    success: any,
    failure: any
  }
};
