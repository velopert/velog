// @flow
import React, { type Node } from 'react';
import './UserContent.scss';

type Props = {
  children: Node,
  side: Node,
};

const UserContent = ({ children, side }: Props) => (
  <div className="UserContent">
    <div className="tab-wrapper">{children}</div>
    <div className="side-wrapper">{side}</div>
  </div>
);

export default UserContent;
