// @flow
import React, { type Node } from 'react';
import './RecentTemplate.scss';

type Props = {
  children: Node,
};

const RecentTemplate = ({ children }: Props) => (
  <div className="RecentTemplate">{children}</div>
);

export default RecentTemplate;
