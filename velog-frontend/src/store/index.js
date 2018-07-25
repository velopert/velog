// @flow
import configure from './configure';
import type { Auth } from './modules/auth';
import type { User } from './modules/user';
import type { Base } from './modules/base';
import type { Write } from './modules/write';
import type { Posts } from './modules/posts';
import type { Sample } from './modules/sample';
import type { Listing } from './modules/listing';
import type { ProfileState } from './modules/profile';
import type { FollowState } from './modules/follow';
import type { CommonState } from './modules/common';
import type { SettingsState } from './modules/settings';

const store = configure();

export default store;

export type State = {
  auth: Auth,
  user: User,
  base: Base,
  write: Write,
  posts: Posts,
  sample: Sample,
  listing: Listing,
  profile: ProfileState,
  follow: FollowState,
  common: CommonState,
  settings: SettingsState,
  pender: {
    pending: any,
    success: any,
    failure: any,
  },
};
