// @flow
import React, { type Node } from 'react';
import PostComment from 'components/post/PostComment';
import type { Comment, SubcommentsMap } from 'store/modules/posts';
import { Link } from 'react-router-dom';

import './PostComments.scss';

type Props = {
  commentInput: Node,
  commentsCount: number,
  comments: ?(Comment[]),
  onReply: (text: string, replyTo: ?string, parentId?: ?string) => Promise<*>,
  onReadReplies: (commentId: string, parentId?: ?string) => Promise<*>,
  subcommentsMap: SubcommentsMap,
  logged: boolean,
  username: ?string,
  onOpenRemove: (payload: { commentId: string, parentId: ?string }) => any,
  onEditComment: ({
    commentId: string,
    parentId: ?string,
    text: string,
  }) => any,
  currentPath: string,
};

const PostComments = ({
  commentInput,
  comments,
  onReply,
  onReadReplies,
  subcommentsMap,
  logged,
  username,
  onOpenRemove,
  onEditComment,
  commentsCount,
  currentPath,
}: Props) => (
  <div className="PostComments">
    <h3>{commentsCount}개의 댓글</h3>
    <div className="comment-input">{commentInput}</div>
    {!logged && (
      <div className="ask-login">
        <Link to={`/?next=${currentPath}`}>로그인</Link> 후 댓글을 작성 할 수 있습니다.
      </div>
    )}
    <div className="comment-list">
      {comments &&
        comments.map((comment) => {
          return (
            <PostComment
              key={comment.id}
              id={comment.id}
              username={comment.user.username}
              thumbnail={comment.user.thumbnail}
              date={comment.created_at}
              comment={comment.text}
              replies={subcommentsMap[comment.id]}
              repliesCount={comment.replies_count}
              subcommentsMap={subcommentsMap}
              onReadReplies={onReadReplies}
              onReply={onReply}
              logged={logged}
              currentUsername={username}
              onOpenRemove={onOpenRemove}
              onEditComment={onEditComment}
            />
          );
        })}
    </div>
  </div>
);

export default PostComments;
