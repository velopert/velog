// @flow
import React, { type Node } from 'react';
import './ViewerHead.scss';

type Props = {
  rightCorner: Node,
};

const ViewerHead = ({ rightCorner }: Props) => (
  <div className="ViewerHead">
    <div className="logo-area">velog</div>
    <div className="right-corner">{rightCorner}</div>
  </div>
);

export default ViewerHead;
