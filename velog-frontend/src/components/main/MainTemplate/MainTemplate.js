// @flow
import React, { type Node } from 'react';
import BackgroundColor from 'components/common/BackgroundColor';
import './MainTemplate.scss';

type Props = {
  children: Node,
  sidebar: Node,
};

const MainTemplate = ({ children, sidebar }: Props) => (
  <div className="MainTemplate">
    <BackgroundColor color="#f1f3f5" />
    {sidebar}
    {children}
  </div>
);

export default MainTemplate;
