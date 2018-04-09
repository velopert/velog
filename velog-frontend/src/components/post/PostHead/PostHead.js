// @flow
import React from 'react';
import Responsive from 'components/common/Responsive';
import './PostHead.scss';

type Props = {
  title: string,
  tags: string[]
};

const PostHead = ({ title, tags }: Props) => (
  <div className="PostHead">
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
      {title}
    </h1>
    <div className="tags">
      {
        tags.map(tag => (<span className="tag" key={tag}>{tag}</span>))
      }
    </div>
  </div>
);

export default PostHead;