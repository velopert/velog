// @flow
import React, { type Node } from 'react';
import './TrendingTemplate.scss';

type Props = {
  children: Node,
};

const TrendingTemplate = ({ children }: Props) => (
  <div className="TrendingTemplate">{children}</div>
);

export default TrendingTemplate;
