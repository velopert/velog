import React, { Fragment } from 'react';
import './WritePanes.scss';

const WritePanes = ({ left, right }) => {
  return (
    <Fragment>
      <div className="pane">{left}</div>
      <div className="pane right">{right}</div>
    </Fragment>
  );
};

export default WritePanes;