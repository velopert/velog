// @flow
import React from 'react';
import './TagItem.scss';

type Props = {
  name: string,
  count: number,
};

const TagItem = ({ name, count }: Props) => (
  <div className="TagItem">
    <div className="name">{name}</div>
    <div className="counts">{count}</div>
  </div>
);

export default TagItem;
