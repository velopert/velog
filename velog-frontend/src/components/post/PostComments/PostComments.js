// @flow
import React, { type Node } from 'react';
import PostComment from 'components/post/PostComment';
import type { Comment } from 'store/modules/posts';

import './PostComments.scss';

type Props = {
  commentInput: Node,
  comments: ?(Comment[]),
  onReply: (text: string, replyTo: ?string) => Promise<*>,
};

const PostComments = ({ commentInput, comments, onReply }: Props) => (
  <div className="PostComments">
    <h4>{comments ? comments.length : 0}개의 댓글</h4>
    <div className="comment-input">{commentInput}</div>
    <div className="comment-list">
      {comments &&
        comments.map((comment) => {
          return (
            <PostComment
              key={comment.id}
              id={comment.id}
              username={comment.user.username}
              thumbnail={comment.user.thumbnail}
              comment={comment.text}
              repliesCount={comment.replies_count}
              onReply={onReply}
            />
          );
        })}
    </div>
  </div>
);

export default PostComments;
