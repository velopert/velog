import React, { Fragment } from 'react';

const WritePanes = ({ left, right }) => {
  return (
    <Fragment>
      <div className="pane">{left}</div>
      <div className="pane">{right}</div>
    </Fragment>
  );
};

export default WritePanes;