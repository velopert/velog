// @flow
import React from 'react';
import './PostTags.scss';

type Props = {
  tags: string[],
};

const PostTags = ({ tags }: Props) => (
  <div className="PostTags">{tags.map(t => <a key={t}>{t}</a>)}</div>
);

export default PostTags;
