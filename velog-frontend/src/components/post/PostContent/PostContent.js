// @flow
import React from 'react';
import Responsive from 'components/common/Responsive';
import MarkdownRender from 'components/common/MarkdownRender';
import './PostContent.scss';

type Props = {
  body: string,
  theme: string,
  thumbnail: ?string,
  onSetToc: (toc: any) => void,
  onActivateHeading: (headingId: string) => void,
};

const PostContent = ({ body, onSetToc, onActivateHeading, thumbnail, theme }: Props) => (
  <div className="PostContent">
    {thumbnail && (
      <div className="post-thumbnail">
        <img src={thumbnail} alt="" />
      </div>
    )}
    <div className="contents">
      <MarkdownRender
        body={body}
        onSetToc={onSetToc}
        onActivateHeading={onActivateHeading}
        theme={theme || 'github'}
      />
    </div>
  </div>
);

PostContent.Placeholder = () => (
  <div className="PostContent placeholder">
    <div className="post-thumbnail">
      <div className="fake-img" />
    </div>
    <div className="contents">
      <div className="gray-block" />
      <div className="gray-block" />
      <div className="gray-block" style={{ width: '75%' }} />
      <div className="line-breaker" />
      <div className="gray-block" />
      <div className="gray-block" style={{ width: '40%' }} />
      <div className="line-breaker" />
      <div className="gray-block" />
      <div className="gray-block" />
      <div className="gray-block" />
      <div className="gray-block" style={{ width: '40%' }} />
    </div>
  </div>
);

export default PostContent;
