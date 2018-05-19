// @flow
import React from 'react';
import PostCard from 'components/common/PostCard';
import type { PostItem } from 'store/modules/listing';
import './PostCardList.scss';

type Props = {
  posts?: ?(PostItem[]),
};

const PostCardList = ({ posts }: Props) => {
  if (!posts) return null;
  const postList = posts.map(post => (
    <PostCard
      key={post.id}
      thumbnail={post.thumbnail}
      username={post.user.username}
      title={post.title}
      body={post.body}
    />
  ));
  return <div className="PostCardList">{postList}</div>;
};

PostCardList.defaultProps = {
  posts: [],
};

export default PostCardList;
