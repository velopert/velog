// @flow
import React, { type Node } from 'react';
import Responsive from 'components/common/Responsive';
import './MainTemplate.scss';

type Props = {
  tab: Node,
  children: Node,
}

const MainTemplate = ({ tab, children }: Props) => (
  <Responsive className="MainTemplate">
    <div className="tab-area">
      {tab}
    </div>
    {children}
  </Responsive>
);

export default MainTemplate;