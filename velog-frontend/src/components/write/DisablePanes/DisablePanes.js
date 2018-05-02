// @flow
import React from 'react';
import './DisablePanes.scss';

type Props = {
  visible: boolean,
};

const DisablePanes = ({ visible }: Props) => {
  if (!visible) return null;
  return <div className="DisablePanes" />;
};

export default DisablePanes;
