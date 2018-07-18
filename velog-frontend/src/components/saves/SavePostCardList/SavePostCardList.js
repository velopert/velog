// @flow
import React from 'react';
import type { PostItem } from 'store/modules/listing';
import './SavePostCardList.scss';
import SavePostCard from '../SavePostCard';

type Props = {
  posts: ?(PostItem[]),
};

const SavePostCardList = ({ posts }: Props) => {
  if (!posts) return null;
  const postList = posts.map(post => (
    <SavePostCard
      key={post.id}
      id={post.id}
      title={post.title}
      thumbnail={post.thumbnail}
      updatedAt={post.updated_at}
    />
  ));
  return <div className="SavePostCardList">{postList}</div>;
};

export default SavePostCardList;
