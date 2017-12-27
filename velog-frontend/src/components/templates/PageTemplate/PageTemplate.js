// @flow
import React from 'react';
import type { Node } from 'react';
import './PageTemplate.scss';

type Props = {
  header: Node,
  children: Node
}

const PageTemplate = ({ header, children } : Props) => {
  return (
    <div className="page-template">
      {header}
      <main>
        {children}
      </main>
    </div>
  );
};

export default PageTemplate;
