import {
  EmailAuth,
  SocialAccount,
  User,
  UserProfile,
  Post,
  Category,
  PostsCategories,
  Tag,
  PostsTags,
} from './models';

export default function sync() {
  // configure relations
  UserProfile.associate();
  SocialAccount.associate();
  Post.associate();
  Category.associate();
  PostsCategories.associate();
  PostsTags.associate();

  if (process.env.SYNC_DB !== 'true') {
    return;
  }
  // sync Models
  User.sync();
  UserProfile.sync();
  SocialAccount.sync();
  EmailAuth.sync();
  Post.sync();
  Category.sync();
  PostsCategories.sync();
  Tag.sync();
  PostsTags.sync();
}

