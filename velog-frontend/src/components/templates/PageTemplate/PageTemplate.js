// @flow
import React from 'react';
import './PageTemplate.scss';

type Props = {
  header: React.ReactNode,
  children: React.ReactNode
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
