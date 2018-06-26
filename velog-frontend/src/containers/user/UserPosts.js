// @flow
import React, { Component } from 'react';
import PostCardList from 'components/common/PostCardList/PostCardList';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { ListingActions } from 'store/actionCreators';
import type { State } from 'store';
import type { PostItem } from 'store/modules/listing';
import debounce from 'lodash/debounce';
import { getScrollBottom, preventStickBottom } from 'lib/common';

type Props = {
  posts: ?(PostItem[]),
  prefetched: ?(PostItem[]),
  hasEnded: boolean,
  prefetching: boolean,
  loading: boolean,
  username: string,
};

class UserPosts extends Component<Props> {
  prevCursor: ?string = null;

  initialize = async () => {
    const { username } = this.props;
    ListingActions.getUserPosts({ username });
  };
  componentDidMount() {
    this.initialize();
    this.listenScroll();
  }
  componentWillUnmount() {
    this.unlistenScroll();
  }
  prefetch = async () => {
    const { prefetched, hasEnded, posts, prefetching, loading, username } = this.props;
    if (prefetched) {
      ListingActions.revealPrefetched('user');
      await Promise.resolve(); // next tick
    }
    if (hasEnded || prefetching || loading || !posts || posts.length === 0) return;
    const lastId = posts[posts.length - 1].id;
    if (this.prevCursor === lastId) return;
    this.prevCursor = lastId;
    try {
      await ListingActions.prefetchUserPosts({
        username,
        cursor: lastId,
      });
      preventStickBottom();
    } catch (e) {
      console.log(e);
    }
  };

  onScroll = debounce(() => {
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
    posts: listing.user.posts,
    prefetched: listing.user.prefetched,
    hasEnded: listing.user.end,
    prefetching: pender.pending['listing/PREFETCH_USER_POSTS'],
    loading: pender.pending['listing/GET_USER_POSTS'],
  }),
  () => ({}),
)(UserPosts);
