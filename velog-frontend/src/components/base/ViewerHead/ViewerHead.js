// @flow
import React, { type Node } from 'react';
import { Link } from 'react-router-dom';
import './ViewerHead.scss';

type Props = {
  rightCorner: Node,
};

const ViewerHead = ({ rightCorner }: Props) => (
  <div className="ViewerHead">
    <Link to="/" className="logo-area">
      velog
    </Link>
    <div className="right-corner">{rightCorner}</div>
  </div>
);

export default ViewerHead;
