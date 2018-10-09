// @flow
import React, { Component } from 'react';
import PostCardList from 'components/common/PostCardList/PostCardList';
import type { State } from 'store';
import { ListingActions } from 'store/actionCreators';
import type { PostItem } from 'store/modules/listing';
import { connect } from 'react-redux';
import throttle from 'lodash/throttle';
import { getScrollBottom, preventStickBottom } from 'lib/common';

type Props = {
  posts: ?(PostItem[]),
  prefetched: ?(PostItem[]),
  prefetching: boolean,
  loading: boolean,
  width: number,
  hasEnded: boolean,
  shouldCancel: boolean,
};

class RecentPostCards extends Component<Props> {
  prevCursor: ?string = null;

  prefetch = async () => {
    const { posts, prefetching, loading } = this.props;
    if (!posts || posts.length === 0 || prefetching || loading) return;
    const lastId = posts[posts.length - 1].id;
    if (this.props.prefetched) {
      ListingActions.revealPrefetched('recent');
      await Promise.resolve(); // next tick
    }
    if (lastId === this.prevCursor) return;
    this.prevCursor = lastId;
    try {
      await ListingActions.prefetchRecentPosts(lastId);
    } catch (e) {
      console.log(e);
    }
    preventStickBottom();
    this.onScroll();
  };

  initialize = async () => {
    try {
      if (this.props.posts && this.props.posts.length > 0) {
        // do not fetch post data when already exists
        return;
      }
      if (!this.props.shouldCancel) {
        await ListingActions.getRecentPosts();
      }
      this.prefetch();
    } catch (e) {
      console.log(e);
    }
  };

  onScroll = throttle(() => {
    const scrollBottom = getScrollBottom();
    if (scrollBottom > 1000) return;
    this.prefetch();
  }, 250);

  listenScroll = () => {
    window.addEventListener('scroll', this.onScroll);
  };

  unlistenScroll = () => {
    window.removeEventListener('scroll', this.onScroll);
  };

  componentDidMount() {
    this.initialize();
    this.listenScroll();
  }
  componentWillUnmount() {
    this.unlistenScroll();
  }

  render() {
    return (
      <PostCardList
        posts={this.props.posts}
        loading={this.props.loading}
        prefetching={
          (this.props.prefetched && this.props.prefetched.length > 0) || this.props.prefetching
        }
        width={this.props.width}
        hasEnded={this.props.hasEnded}
      />
    );
  }
}

const mapStateToProps = ({ listing, pender, base, common }: State) => ({
  posts: listing.recent.posts,
  prefetched: listing.recent.prefetched,
  prefetching: pender.pending['listing/PREFETCH'],
  loading: pender.pending['listing/GET_RECENT_POSTS'],
  width: base.windowWidth,
  hasEnded: listing.recent.end,
  shouldCancel: common.ssr && !common.router.altered,
});

export default connect(mapStateToProps, () => ({}))(RecentPostCards);
