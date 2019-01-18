import db from 'database/db';
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
  Feed,
  PostScore,
  PostRead,
  UrlSlugHistory,
  EmailCert,
  UserMeta,
  UserImage,
  Series,
  SeriesPosts,
} from './models';
import * as views from './views';

export function associate() {
  // configure relations
  User.associate();
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
  Feed.associate();
  PostScore.associate();
  PostRead.associate();
  UrlSlugHistory.associate();
  EmailCert.associate();
  UserMeta.associate();
  UserImage.associate();
  Series.associate();
  SeriesPosts.associate();
}
export default function sync() {
  associate();
  db.sync();
  // // sync Models
  // User.sync();
  // UserProfile.sync();
  // SocialAccount.sync();
  // EmailAuth.sync();
  // Tag.sync();
  // Post.sync();
  // Category.sync();
  // PostsCategories.sync();
  // PostsTags.sync();
  // PostLike.sync();
  // Comment.sync();
  // FollowUser.sync();
  // FollowTag.sync();
  // PostHistory.sync();
  // PostImage.sync();
  // Feed.sync();
}
