// @flow
import React, { type Node } from 'react';
import { Link } from 'react-router-dom';
import RightCorner from 'containers/base/RightCorner';
import './ViewerHead.scss';

type Props = {};

const ViewerHead = (props: Props) => (
  <div className="ViewerHead">
    <Link to="/" className="logo-area">
      velog
    </Link>
    <div className="right-corner">
      <RightCorner />
    </div>
  </div>
);

export default ViewerHead;
