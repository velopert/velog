// @flow

import React from 'react';
import MarkdownRender from 'components/common/MarkdownRender';
import './MarkdownPreview.scss';

type Props = {
  title: string,
  body: string,
  theme: ?string,
};

const MarkdownPreview = ({ title, body, theme }: Props) => {
  return (
    <div className="MarkdownPreview" id="preview">
      <h1>{title}</h1>
      <MarkdownRender body={body} theme={theme} />
    </div>
  );
};

export default MarkdownPreview;
