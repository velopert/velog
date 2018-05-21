// @flow
import React from 'react';
import PostCard from 'components/common/PostCard';
import type { PostItem } from 'store/modules/listing';
import FakePostCard from 'components/common/FakePostCard';
import './PostCardList.scss';

type Props = {
  posts?: ?(PostItem[]),
  loading: boolean,
};

const PostCardList = ({ posts, loading }: Props) => {
  if (loading) {
    return (
      <div className="PostCardList">
        {Array.from(Array(10).keys()).map(num => <FakePostCard key={num} />)}
      </div>
    );
  }

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
