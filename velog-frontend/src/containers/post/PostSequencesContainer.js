// @flow
import React, { Component } from 'react';
import type { PostSequence } from 'store/modules/posts';
import { connect } from 'react-redux';
import type { State } from 'store';

import PostSequences from '../../components/post/PostSequences/PostSequences';

type Props = {
  sequences: ?(PostSequence[]),
  username: string,
  currentPostId: string,
};

class PostSequencesContainer extends Component<Props> {
  render() {
    const { sequences, username, currentPostId } = this.props;

    return (
      <PostSequences sequences={sequences} username={username} currentPostId={currentPostId} />
    );
  }
}

export default connect(
  ({ posts }: State) => ({
    sequences: posts.sequences,
    currentPostId: posts.post && posts.post.id,
  }),
  () => ({}),
)(PostSequencesContainer);
