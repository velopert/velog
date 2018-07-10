// @flow
import React from 'react';
import TagItem from 'components/tags/TagItem';
import { type TagData } from 'store/modules/common';
import './TagItemList.scss';

type Props = {
  tags: ?(TagData[]),
  onSelectTag: (info: any) => void,
};

const TagItemList = ({ tags, onSelectTag }: Props) => {
  if (!tags) return null;
  const tagList = tags.map(({ name, posts_count: postsCount }) => (
    <TagItem name={name} count={postsCount} key={name} onClick={onSelectTag} />
  ));
  return <div className="TagItemList">{tagList}</div>;
};

export default TagItemList;
