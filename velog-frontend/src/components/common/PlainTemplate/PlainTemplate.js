// @flow
import React, { type Node } from 'react';
import './PlainTemplate.scss';

type Props = {
  header: Node,
  children: Node,
};

const PlainTemplate = ({ children, header }: Props) => (
  <div className="PlainTemplate">
    <div className="header-area">{header}</div>
    <div className="content-area">{children}</div>
  </div>
);

export default PlainTemplate;
