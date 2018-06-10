// @flow
import React, { Component } from 'react';
import type { State } from 'store';
import { connect } from 'react-redux';
import PostComments from 'components/post/PostComments/PostComments';
import PostCommentInput from 'components/post/PostCommentInput/PostCommentInput';

type Props = {};

class PostCommentsContainer extends Component<Props> {
  render() {
    return <PostComments commentInput={<PostCommentInput />} />;
  }
}

export default PostCommentsContainer;
