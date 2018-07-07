// @flow
import React from 'react';
import TagItem from 'components/tags/TagItem';
import { type TagData } from 'store/modules/common';
import './TagItemList.scss';

type Props = {
  tags: ?(TagData[]),
};

const TagItemList = ({ tags }: Props) => {
  if (!tags) return null;
  console.log(tags);
  const tagList = tags.map(({ name, posts_count: postsCount }) => (
    <TagItem name={name} count={postsCount} key={name} />
  ));
  return <div className="TagItemList">{tagList}</div>;
};

export default TagItemList;
