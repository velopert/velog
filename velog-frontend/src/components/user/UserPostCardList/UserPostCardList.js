// @flow
import React from 'react';
import type { PostItem } from 'store/modules/listing';
import './UserPostCardList.scss';
import UserPostCard from '../UserPostCard';

type Props = {
  posts: PostItem[],
  username: string,
};

const UserPostCardList = ({ posts, username }: Props) => {
  const postList = posts.map(post => (
    <UserPostCard username={username} key={post.id} post={post} />
  ));
  return <div className="UserPostCardList">{postList}</div>;
};

UserPostCardList.Placeholder = () => {
  return (
    <div className="UserPostCardList">
      <UserPostCard.Placeholder />
      <UserPostCard.Placeholder />
      <UserPostCard.Placeholder />
    </div>
  );
};

export default UserPostCardList;
