// @flow
import React from 'react';
import type { Node } from 'react';
import './PageTemplate.scss';

type Props = {
  header: Node,
  children: Node,
};

const PageTemplate = ({ header, children }: Props) => {
  return (
    <div className="PageTemplate">
      {header}
      <main>{children}</main>
    </div>
  );
};

export default PageTemplate;
