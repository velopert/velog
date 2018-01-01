import {
  EmailAuth,
  SocialAccount,
  User,
  UserProfile,
} from './models';

export default function sync() {
  // sync Models
  User.sync();
  UserProfile.sync();
  SocialAccount.sync();
  EmailAuth.sync();

  // configure relations
  UserProfile.associate();
  SocialAccount.associate();
}


// configure relations

