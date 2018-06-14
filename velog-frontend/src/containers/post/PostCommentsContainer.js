// @flow
import React, { Component } from 'react';
import type { State } from 'store';
import { connect } from 'react-redux';
import PostComments from 'components/post/PostComments/PostComments';
import PostCommentInput from 'components/post/PostCommentInput/PostCommentInput';
import { PostsActions } from 'store/actionCreators';

type Props = {
  postId: ?string,
};

class PostCommentsContainer extends Component<Props> {
  onWriteComment = (text: string, replyTo: ?string) => {
    const { postId } = this.props;
    if (!postId) return Promise.resolve();
    return PostsActions.writeComment({
      postId,
      text,
      replyTo,
    });
  };

  render() {
    return (
      <PostComments commentInput={<PostCommentInput onWriteComment={this.onWriteComment} />} />
    );
  }
}

export default connect(
  (state: State) => ({
    postId: state.posts.post && state.posts.post.id,
  }),
  () => ({}),
)(PostCommentsContainer);
