// @flow
import React, { type Node } from 'react';
import './SavesTemplate.scss';

type Props = {
  header: Node,
  children: Node,
};

const SavesTemplate = ({ header, children }: Props) => (
  <div className="SavesTemplate">
    {header}
    <main>
      <h2>임시 글 목록</h2>
      {children}
    </main>
  </div>
);

export default SavesTemplate;
