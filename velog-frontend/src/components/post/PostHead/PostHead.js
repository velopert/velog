// @flow
import React from 'react';
import Responsive from 'components/common/Responsive';
import type { Categories } from 'store/modules/posts';
import './PostHead.scss';

type Props = {
  title: string,
  categories: Categories,
  user: any,
};

const PostHead = ({ title, categories, user }: Props) => {
  return (
    <div className="PostHead">
      <h4 className="category">
        {categories.map(c => (
          <span className="category-name" key={c.id}>
            {c.name}
          </span>
        ))}
      </h4>
      <div className="userinfo">
        <div className="user-thumbnail">
          <img src="https://avatars0.githubusercontent.com/u/17202261?v=4" alt="user-thumbnail" />
        </div>
        <div className="info">
          <div className="username">@velopert</div>
          <div className="description">Frontend Engineer at Laftel</div>
        </div>
      </div>
      <h1>{title}</h1>
      <div className="date">2018년 5월 25일</div>
      <div className="separator" />
    </div>
  );
};

/*
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
*/

export default PostHead;
