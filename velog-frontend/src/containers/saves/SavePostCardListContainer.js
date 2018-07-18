// @flow
import React, { Component } from 'react';
import { ListingActions } from 'store/actionCreators';
import type { State } from 'store';
import { connect } from 'react-redux';
import SavePostCardList from 'components/saves/SavePostCardList/SavePostCardList';
import type { PostItem } from 'store/modules/listing';
import throttle from 'lodash/throttle';
import { getScrollBottom, preventStickBottom } from 'lib/common';

type Props = {
  username: ?string,
  posts: ?(PostItem[]),
  prefetching: boolean,
  loading: boolean,
  hasEnded: boolean,
};

class SavePostCardListContainer extends Component<Props> {
  prevCursor: ?string = null;

  initialize = async () => {
    if (!this.props.username) return;
    try {
      await ListingActions.getTempPosts({
        username: this.props.username,
      });
      this.prefetch();
    } catch (e) {
      console.log(e);
    }
  };

  componentDidMount() {
    this.initialize();
    window.addEventListener('scroll', this.onScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.username && this.props.username) {
      this.initialize();
    }
  }

  prefetch = async () => {};

  onScroll = throttle(() => {
    const scrollBottom = getScrollBottom();
    if (scrollBottom > 1000) return;
    this.prefetch();
  }, 250);

  render() {
    const { posts } = this.props;
    return <SavePostCardList posts={posts} />;
  }
}

export default connect(
  ({ user, listing, pender }: State) => ({
    username: user.user && user.user.username,
    posts: listing.temp.posts,
    prefetching: pender.pending['listing/PREFETCH_TEMP_POSTS'],
    loading: pender.pending['listing/GET_TEMP_POSTS'],
    hasEnded: listing.temp.end,
  }),
  () => ({}),
)(SavePostCardListContainer);
