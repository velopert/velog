// @flow
import React from 'react';
import Responsive from 'components/common/Responsive';
import './PostHead.scss';

type Props = { }

const PostHead = (props: Props) => (
  <Responsive className="PostHead">
    <div className="sub-info">
      <div className="thumbnail util flex-center">
        <img
          src="https://avatars0.githubusercontent.com/u/17202261?v=4"
          alt="user-thumbnail"
        />
      </div>
      <div className="information">
        <div>
          <div className="username">@velopert</div>
          <div className="description">Frontend Engineer at Laftel Inc.</div>
          <div className="date-time">Mar 30</div>
        </div>
      </div>
    </div>
    <h1>
      리액트 16.3 새로워진 Context API 파헤치기
    </h1>
    <div className="tags">
      <span className="tag">React</span>
      <span className="tag">JavaScript</span>
      <span className="tag">Context</span>
    </div>
  </Responsive>
);

export default PostHead;