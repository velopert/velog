// @flow
import React, { Component } from 'react';
import PlusIcon from 'react-icons/lib/fa/plus-square-o';
import MinusIcon from 'react-icons/lib/fa/minus-square-o';
import PostCommentInput from 'components/post/PostCommentInput/PostCommentInput';
import Button from 'components/common/Button';

import './PostComment.scss';

type Props = {
  username: string,
  thumbnail: ?string,
  comment: string,
  repliesCount: number,
  level: number,
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

  render() {
    const { username, thumbnail, comment, repliesCount, level } = this.props;
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
            <PostComment
              username="velopert"
              thumbnail="https://avatars0.githubusercontent.com/u/17202261?v=4"
              comment="덧글내용이 이래 막"
              level={level + 1}
            />
            <PostComment
              username="velopert"
              thumbnail="https://avatars0.githubusercontent.com/u/17202261?v=4"
              comment="덧글내용이 이래 막"
              level={level + 1}
            />
            <PostComment
              username="velopert"
              thumbnail="https://avatars0.githubusercontent.com/u/17202261?v=4"
              comment="덧글내용이 이래 막"
              level={level + 1}
            />
            {showInput ? (
              <PostCommentInput showCancel onCancel={this.onHideInput} />
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
