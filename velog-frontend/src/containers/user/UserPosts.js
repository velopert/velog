// @flow
import React, { Component } from 'react';
import PostCardList from 'components/common/PostCardList/PostCardList';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { ListingActions } from 'store/actionCreators';
import type { State } from 'store';
import type { PostItem } from 'store/modules/listing';

type Props = {
  posts: ?(PostItem[]),
  loading: boolean,
  username: string,
};

class UserPosts extends Component<Props> {
  initialize = async () => {
    const { username } = this.props;
    ListingActions.getUserPosts({ username });
  };
  componentDidMount() {
    this.initialize();
  }

  render() {
    const { posts, loading } = this.props;
    return (
      <PostCardList
        posts={posts}
        oneColumn
        loading={loading}
        prefetching={false}
        hasEnded={false}
      />
    );
  }
}

export default connect(
  ({ listing, pender }: State) => ({
    posts: listing.userPosts,
    loading: pender.pending['listing/GET_USER_POSTS'],
  }),
  () => ({}),
)(UserPosts);
