// @flow
import React, { Component, Fragment } from 'react';
import type { State } from 'store';
import { connect } from 'react-redux';
import PostComments from 'components/post/PostComments/PostComments';
import PostCommentInput from 'components/post/PostCommentInput/PostCommentInput';
import { PostsActions } from 'store/actionCreators';
import type { Comment, SubcommentsMap, RemoveComment } from 'store/modules/posts';
import QuestionModal from 'components/common/QuestionModal';
import { withRouter, type ContextRouter } from 'react-router-dom';

type Props = {
  postId: ?string,
  comments: ?(Comment[]),
  subcommentsMap: SubcommentsMap,
  shouldCancel: boolean,
  logged: boolean,
  loading: boolean,
  username: ?string,
  removeComment: RemoveComment,
  commentsCount: ?number,
} & ContextRouter;

class PostCommentsContainer extends Component<Props> {
  onOpenRemove = (payload: { commentId: string, parentId: ?string }) => {
    PostsActions.openCommentRemove(payload);
  };

  onCancelRemove = () => {
    PostsActions.cancelCommentRemove();
  };

  onConfirmRemove = () => {
    const { postId, removeComment } = this.props;
    if (!postId || !removeComment.commentId) return;
    PostsActions.removeComment({
      postId,
      commentId: removeComment.commentId,
    });
  };

  onEditComment = ({
    commentId,
    parentId,
    text,
  }: {
    commentId: string,
    parentId: ?string,
    text: string,
  }) => {
    const { postId } = this.props;
    if (!postId) return Promise.resolve();
    return PostsActions.editComment({
      postId,
      commentId,
      text,
      parentId,
    });
  };

  onWriteComment = async (text: string, replyTo: ?string, parentId?: ?string) => {
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
        await this.onReadReplies(replyTo, parentId);
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

  onReadReplies = (commentId: string, parentId?: ?string) => {
    const { postId } = this.props;
    if (!postId) return Promise.resolve(null);
    return PostsActions.readSubcomments({
      postId,
      commentId,
      parentId,
    });
  };

  render() {
    const {
      comments,
      subcommentsMap,
      logged,
      loading,
      username,
      removeComment,
      commentsCount,
    } = this.props;

    if (loading) return null;

    return (
      <Fragment>
        <PostComments
          logged={logged}
          commentInput={logged && <PostCommentInput onWriteComment={this.onWriteComment} />}
          comments={comments}
          subcommentsMap={subcommentsMap}
          onReply={this.onWriteComment}
          onReadReplies={this.onReadReplies}
          username={username}
          onOpenRemove={this.onOpenRemove}
          onEditComment={this.onEditComment}
          commentsCount={commentsCount || 0}
          currentPath={this.props.location.pathname}
        />
        <QuestionModal
          title="댓글 삭제"
          description="이 댓글을 정말로 삭제하시겠습니까?"
          confirmText="삭제하기"
          onConfirm={this.onConfirmRemove}
          onCancel={this.onCancelRemove}
          open={removeComment.visible}
        />
      </Fragment>
    );
  }
}

export default connect(
  (state: State) => ({
    logged: !!state.user.user,
    postId: state.posts.post && state.posts.post.id,
    comments: state.posts.comments,
    subcommentsMap: state.posts.subcommentsMap,
    shouldCancel: state.common.ssr && !state.common.router.altered,
    loading: !state.posts.post || state.pender.pending['posts/READ_COMMENTS'],
    username: state.user.user && state.user.user.username,
    removeComment: state.posts.removeComment,
    commentsCount: state.posts.post && state.posts.post.comments_count,
  }),
  () => ({}),
)(withRouter(PostCommentsContainer));
