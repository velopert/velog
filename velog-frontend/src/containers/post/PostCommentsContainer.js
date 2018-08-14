// @flow
import React, { Component } from 'react';
import type { State } from 'store';
import { connect } from 'react-redux';
import PostComments from 'components/post/PostComments/PostComments';
import PostCommentInput from 'components/post/PostCommentInput/PostCommentInput';
import { PostsActions } from 'store/actionCreators';
import type { Comment, SubcommentsMap } from 'store/modules/posts';

type Props = {
  postId: ?string,
  comments: ?(Comment[]),
  subcommentsMap: SubcommentsMap,
  shouldCancel: boolean,
  logged: boolean,
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
        await this.onReadReplies(replyTo);
      } else {
        await PostsActions.readComments({ postId });
      }
    } catch (e) {
      console.log(e);
    }
    return comment;
  };

  initialize = async () => {
    const { postId, shouldCancel } = this.props;
    if (!postId) return;
    try {
      if (shouldCancel) return;
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

  onReadReplies = (commentId: string) => {
    const { postId } = this.props;
    if (!postId) return Promise.resolve(null);
    return PostsActions.readSubcomments({
      postId,
      commentId,
    });
  };

  render() {
    const { comments, subcommentsMap, logged } = this.props;

    return (
      <PostComments
        logged={logged}
        commentInput={logged && <PostCommentInput onWriteComment={this.onWriteComment} />}
        comments={comments}
        subcommentsMap={subcommentsMap}
        onReply={this.onWriteComment}
        onReadReplies={this.onReadReplies}
      />
    );
  }
}

export default connect(
  (state: State) => ({
    logged: !!state.user.user,
    postId: state.posts.post && state.posts.post.id,
    comments: state.posts.comments,
    subcommentsMap: state.posts.subcommentsMap,
    shouldCancel: state.common.ssr && state.common.router.history.length === 0,
  }),
  () => ({}),
)(PostCommentsContainer);
