// @flow
import React, { type Node } from 'react';
import './TrandingSection.scss';

type Props = {
  title: string,
  children: Node,
};

const TrandingSection = ({ children, title }: Props) => (
  <div className="TrandingSection">
    <h2>{title}</h2>
    <div className="contents">{children}</div>
  </div>
);

export default TrandingSection;
