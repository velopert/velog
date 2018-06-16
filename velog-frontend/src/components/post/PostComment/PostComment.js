// @flow
import React, { Component } from 'react';
import PlusIcon from 'react-icons/lib/fa/plus-square-o';
import MinusIcon from 'react-icons/lib/fa/minus-square-o';
import PostCommentInput from 'components/post/PostCommentInput/PostCommentInput';
import Button from 'components/common/Button';
import type { Comment, SubcommentsMap } from 'store/modules/posts';

import './PostComment.scss';

type Props = {
  username: string,
  thumbnail: ?string,
  comment: string,
  repliesCount: number,
  level: number,
  id: string,
  replies: ?(Comment[]),
  subcommentsMap: SubcommentsMap,
  onReply: (text: string, replyTo: ?string) => Promise<*>,
  onReadReplies: (commentId: string) => Promise<*>,
};

type State = {
  open: boolean,
  showInput: boolean,
};

class PostComment extends Component<Props, State> {
  static defaultProps = {
    repliesCount: 0,
    level: 0,
  };

  state = {
    open: false,
    showInput: false,
  };

  onOpen = () => {
    this.readReplies();
    this.setState({
      open: true,
      showInput: false,
    });
  };

  onClose = () => {
    this.setState({
      open: false,
    });
  };

  onShowInput = () => {
    this.setState({
      showInput: true,
    });
  };

  onHideInput = () => {
    this.setState({
      showInput: false,
    });
  };

  readReplies = () => {
    const { onReadReplies, id } = this.props;
    onReadReplies(id);
  };

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    const compare = (key) => {
      return nextProps[key] !== this.props[key];
    };

    return (
      this.state !== nextState ||
      compare('replies') ||
      compare('comment') ||
      compare('repliesCount')
    );
  }

  render() {
    const {
      username,
      thumbnail,
      comment,
      repliesCount,
      level,
      id,
      onReply,
      replies,
      subcommentsMap,
      onReadReplies,
    } = this.props;
    const { open, showInput } = this.state;
    return (
      <div className="PostComment">
        <div className="comment-head">
          <img src={thumbnail} alt={username} />
          <div className="text-block">
            <div className="username">{username}</div>
            <div className="date">2018.06.11</div>
          </div>
        </div>
        <div className="comment-body">{comment}</div>
        {level < 3 &&
          (open ? (
            <button className="replies-button" onClick={this.onClose}>
              <MinusIcon />
              숨기기
            </button>
          ) : (
            <button className="replies-button" onClick={this.onOpen}>
              <PlusIcon />
              {repliesCount === 0 ? '답글 달기' : `${repliesCount}개의 답글`}
            </button>
          ))}
        {open && (
          <section className="replies">
            {replies &&
              replies.map((reply) => {
                return (
                  <PostComment
                    key={reply.id}
                    id={reply.id}
                    username={reply.user.username}
                    thumbnail={reply.user.thumbnail}
                    comment={reply.text}
                    replies={subcommentsMap[reply.id]}
                    repliesCount={reply.replies_count}
                    subcommentsMap={subcommentsMap}
                    onReadReplies={onReadReplies}
                    onReply={onReply}
                    level={level + 1}
                  />
                );
              })}
            {showInput ? (
              <PostCommentInput
                showCancel
                onCancel={this.onHideInput}
                onWriteComment={onReply}
                replyTo={id}
              />
            ) : (
              <button className="show-input-button" onClick={this.onShowInput}>
                답글 작성하기
              </button>
            )}
          </section>
        )}
      </div>
    );
  }
}

export default PostComment;
