// @flow
import React, { type Node } from 'react';
import { Route } from 'react-router-dom';

type Props = {
  code: number,
  children: Node,
};

const RespStatus = ({ code, children }: Props) => {
  return (
    <Route
      // $FlowFixMe
      render={({ staticContext }) => {
        if (staticContext) {
          // $FlowFixMe
          staticContext.status = code;
        }
        return children;
      }}
    />
  );
};

export default RespStatus;
