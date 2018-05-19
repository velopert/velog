// @flow
import React, { Component } from 'react';
import PostCardList from 'components/common/PostCardList/PostCardList';
import type { State } from 'store';
import { ListingActions } from 'store/actionCreators';
import type { PostItem } from 'store/modules/listing';
import { connect } from 'react-redux';

type Props = {
  posts: ?(PostItem[]),
  prefetched: ?(PostItem[]),
};

class RecentPostCards extends Component<Props> {
  initialize = async () => {
    try {
      ListingActions.getRecentPosts();
    } catch (e) {
      console.log(e);
    }
  };
  componentDidMount() {
    this.initialize();
  }

  render() {
    return <PostCardList posts={this.props.posts} />;
  }
}

const mapStateToProps = ({ listing }: State) => ({
  posts: listing.recentPosts,
  prefetched: listing.prefetchedRecentPosts,
});

export default connect(mapStateToProps, () => ({}))(RecentPostCards);
