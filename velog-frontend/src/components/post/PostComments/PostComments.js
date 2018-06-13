// @flow
import React, { type Node } from 'react';
import PostComment from 'components/post/PostComment';

import './PostComments.scss';

type Props = {
  commentInput: Node,
};

const PostComments = ({ commentInput }: Props) => (
  <div className="PostComments">
    <h4>0개의 댓글</h4>
    <div className="comment-input">{commentInput}</div>
    <div className="comment-list">
      <PostComment
        username="velopert"
        thumbnail="https://avatars0.githubusercontent.com/u/17202261?v=4"
        comment="덧글내용이 이래 막"
        repliesCount={5}
      />
      <PostComment
        username="velopert"
        thumbnail="https://avatars0.githubusercontent.com/u/17202261?v=4"
        comment="덧글내용이 이래 막 덧글내용이 이래 막 덧글내용이 이래 막 덧글내용이 이래 막 덧글내용이 이래 막 덧글내용이 이래 막 덧글내용이 이래 막 "
      />
      <PostComment
        username="velopert"
        thumbnail="https://avatars0.githubusercontent.com/u/17202261?v=4"
        comment="덧글내용이 이래 막"
      />
      <PostComment
        username="velopert"
        thumbnail="https://avatars0.githubusercontent.com/u/17202261?v=4"
        comment="덧글내용이 이래 막"
      />
      <PostComment
        username="velopert"
        thumbnail="https://avatars0.githubusercontent.com/u/17202261?v=4"
        comment="덧글내용이 이래 막"
      />
      <PostComment
        username="velopert"
        thumbnail="https://avatars0.githubusercontent.com/u/17202261?v=4"
        comment="덧글내용이 이래 막"
      />
      <PostComment
        username="velopert"
        thumbnail="https://avatars0.githubusercontent.com/u/17202261?v=4"
        comment="덧글내용이 이래 막"
      />
    </div>
  </div>
);

export default PostComments;
