// @flow
import React from 'react';
import Responsive from 'components/common/Responsive';
import './PostContent.scss';

type Props = { }

const PostContent = (props: Props) => (
  <div className="PostContent">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 10" preserveAspectRatio="none">
      <polygon points="100 0 100 10 0 10" fill="#f8f9fa" />
    </svg>
    <div className="gray-area">
      <Responsive className="floating-box">
        어쩌고저쩌고
      </Responsive>
    </div>
  </div>
);

export default PostContent;