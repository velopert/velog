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
  PostLike,
  Comment,
  FollowUser,
  FollowTag,
  PostHistory,
  PostImage,
} from './models';

export function associate() {
  // configure relations
  UserProfile.associate();
  SocialAccount.associate();
  Post.associate();
  Category.associate();
  PostsCategories.associate();
  PostsTags.associate();
  PostLike.associate();
  Comment.associate();
  FollowUser.associate();
  FollowTag.associate();
  PostHistory.associate();
  PostImage.associate();
}
export default function sync() {
  associate();
  // sync Models
  User.sync();
  UserProfile.sync();
  SocialAccount.sync();
  EmailAuth.sync();
  Tag.sync();
  Post.sync();
  Category.sync();
  PostsCategories.sync();
  PostsTags.sync();
  PostLike.sync();
  Comment.sync();
  FollowUser.sync();
  FollowTag.sync();
  PostHistory.sync();
  PostImage.sync();
}

