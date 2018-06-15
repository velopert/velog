// @flow
import React, { Component } from 'react';
import type { State } from 'store';
import { connect } from 'react-redux';
import PostComments from 'components/post/PostComments/PostComments';
import PostCommentInput from 'components/post/PostCommentInput/PostCommentInput';
import { PostsActions } from 'store/actionCreators';
import type { Comment } from 'store/modules/posts';

type Props = {
  postId: ?string,
  comments: ?(Comment[]),
};

class PostCommentsContainer extends Component<Props> {
  onWriteComment = async (text: string, replyTo: ?string) => {
    const { postId } = this.props;
    if (!postId) return Promise.resolve();
    let comment = null;
    try {
      comment = await PostsActions.writeComment({
        postId,
        text,
        replyTo,
      });
      if (replyTo) {
        console.log('laodd...');
      } else {
        await PostsActions.readComments({ postId });
      }
    } catch (e) {
      console.log(e);
    }
    return comment;
  };

  initialize = async () => {
    const { postId } = this.props;
    if (!postId) return;
    try {
      await PostsActions.readComments({ postId });
    } catch (e) {
      console.log(e);
    }
  };

  componentDidMount() {
    this.initialize();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.postId !== this.props.postId) {
      this.initialize();
    }
  }

  render() {
    const { comments } = this.props;

    return (
      <PostComments
        commentInput={<PostCommentInput onWriteComment={this.onWriteComment} />}
        comments={comments}
        onReply={this.onWriteComment}
      />
    );
  }
}

export default connect(
  (state: State) => ({
    postId: state.posts.post && state.posts.post.id,
    comments: state.posts.comments,
  }),
  () => ({}),
)(PostCommentsContainer);
