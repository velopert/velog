// @flow
import React, { Component, Fragment } from 'react';
import PostHead from 'components/post/PostHead';
import PostContent from 'components/post/PostContent';

type Props = {};

class PostViewer extends Component<Props> {
  render() {
    return (
      <Fragment>
        <PostHead />
        <PostContent />
      </Fragment>
    );
  }
}

export default PostViewer;