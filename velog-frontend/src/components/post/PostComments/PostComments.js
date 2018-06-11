// @flow
import React, { type Node } from 'react';
import PlusIcon from 'react-icons/lib/fa/plus-square-o';

import './PostComments.scss';

type CommentProps = {
  username: string,
  thumbnail: ?string,
  comment: string,
  repliesCount?: number,
  level?: number,
};

const Comment = ({ username, thumbnail, comment, level, repliesCount }: CommentProps) => {
  return (
    <div className="comment">
      <div className="comment-head">
        <img src={thumbnail} alt={username} />
        <div className="text-block">
          <div className="username">{username}</div>
          <div className="date">2018.06.11</div>
        </div>
      </div>
      <div className="comment-body">{comment}</div>
      {!!repliesCount && (
        <div className="replies-count">
          <PlusIcon />
          {repliesCount}개의 응답
        </div>
      )}
    </div>
  );
};

Comment.defaultProps = {
  level: 0,
  repliesCount: 0,
};

type Props = {
  commentInput: Node,
};

const PostComments = ({ commentInput }: Props) => (
  <div className="PostComments">
    <h4>0개의 덧글</h4>
    <div className="comment-input">{commentInput}</div>
    <div className="comment-list">
      <Comment
        username="velopert"
        thumbnail="https://avatars0.githubusercontent.com/u/17202261?v=4"
        comment="덧글내용이 이래 막"
        repliesCount={5}
      />
      <Comment
        username="velopert"
        thumbnail="https://avatars0.githubusercontent.com/u/17202261?v=4"
        comment="덧글내용이 이래 막 덧글내용이 이래 막 덧글내용이 이래 막 덧글내용이 이래 막 덧글내용이 이래 막 덧글내용이 이래 막 덧글내용이 이래 막 "
      />
      <Comment
        username="velopert"
        thumbnail="https://avatars0.githubusercontent.com/u/17202261?v=4"
        comment="덧글내용이 이래 막"
      />
      <Comment
        username="velopert"
        thumbnail="https://avatars0.githubusercontent.com/u/17202261?v=4"
        comment="덧글내용이 이래 막"
      />
      <Comment
        username="velopert"
        thumbnail="https://avatars0.githubusercontent.com/u/17202261?v=4"
        comment="덧글내용이 이래 막"
      />
      <Comment
        username="velopert"
        thumbnail="https://avatars0.githubusercontent.com/u/17202261?v=4"
        comment="덧글내용이 이래 막"
      />
      <Comment
        username="velopert"
        thumbnail="https://avatars0.githubusercontent.com/u/17202261?v=4"
        comment="덧글내용이 이래 막"
      />
    </div>
  </div>
);

export default PostComments;
