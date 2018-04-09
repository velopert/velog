// @flow
import React from 'react';
import Responsive from 'components/common/Responsive';
import MarkdownRender from 'components/common/MarkdownRender';
import './PostContent.scss';

type Props = {
  body: string
};

const PostContent = ({ body }: Props) => (
  <div className="PostContent">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 10" preserveAspectRatio="none">
      <polygon points="0 0, 100 0, 0 10" fill="#ffffff" />
    </svg>
    <div className="wrapper">
      <div className="floating-box">
        <img src="https://velopert.com/wp-content/uploads/2018/02/blog-images.003.png" alt="post-thumbnail" />
        <div className="contents">
          <MarkdownRender body={body} />
        </div>
      </div>
    </div>
  </div>
);

export default PostContent;