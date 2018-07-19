// @flow
import React from 'react';
import type { PostItem } from 'store/modules/listing';
import './SavePostCardList.scss';
import SavePostCard from '../SavePostCard';

type Props = {
  posts: ?(PostItem[]),
  onAskRemove: (postId: string) => void,
};

const SavePostCardList = ({ posts, onAskRemove }: Props) => {
  if (!posts) return null;
  const postList = posts.map(post => (
    <SavePostCard
      key={post.id}
      id={post.id}
      title={post.title}
      thumbnail={post.thumbnail}
      updatedAt={post.updated_at}
      onAskRemove={onAskRemove}
    />
  ));
  return <div className="SavePostCardList">{postList}</div>;
};

export default SavePostCardList;
