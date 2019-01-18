// @flow
import React, { type Node } from 'react';
import './PostTemplate.scss';

type Props = {
  header: Node,
  children: Node,
};

const PostTemplate = ({ children, header }: Props) => (
  <div className="PostTemplate">
    <div className="header-area">{header}</div>
    <div className="post-area">{children}</div>
  </div>
);

export default PostTemplate;
