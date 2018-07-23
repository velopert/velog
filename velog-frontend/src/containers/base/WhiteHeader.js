// @flow
import React from 'react';
import ViewerHead from 'components/base/ViewerHead';
import RightCorner from 'containers/base/RightCorner';

type Props = {};

const WhiteHeader = (props: Props) => {
  return <ViewerHead rightCorner={<RightCorner />} />;
};

export default WhiteHeader;
