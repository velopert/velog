// @flow
import configure from './configure';
import type { AuthRecordType } from './modules/auth';

const store = configure();

export default store;

export type State = {
  auth: AuthRecordType
};
