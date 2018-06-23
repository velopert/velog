// @flow
import React, { type Node } from 'react';
import './UserTemplate.scss';

type Props = {
  header: Node,
  children: Node,
};

const UserTemplate = ({ header, children }: Props) => (
  <div className="UserTemplate">
    <div className="header-area">{header}</div>
    <main>{children}</main>
  </div>
);

export default UserTemplate;
