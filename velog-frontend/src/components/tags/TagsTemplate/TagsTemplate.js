// @flow
import React, { type Node } from 'react';
import './TagsTemplate.scss';

type Props = {
  children: Node,
};

const TagsTemplate = ({ children }: Props) => <div className="TagsTemplate">{children}</div>;

export default TagsTemplate;
