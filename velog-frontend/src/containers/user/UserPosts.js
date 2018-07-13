// @flow
import React, { Component } from 'react';
import PostCardList from 'components/common/PostCardList/PostCardList';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { ListingActions, ProfileActions } from 'store/actionCreators';
import type { State } from 'store';
import type { PostItem } from 'store/modules/listing';
import throttle from 'lodash/throttle';
import { getScrollBottom, preventStickBottom } from 'lib/common';

type OwnProps = {
  username: string,
  tag?: string,
};

type Props = OwnProps & {
  posts: ?(PostItem[]),
  prefetched: ?(PostItem[]),
  hasEnded: boolean,
  prefetching: boolean,
  loading: boolean,
  rawTagName: ?string,
};

class UserPosts extends Component<Props> {
  prevCursor: ?string = null;

  initialize = async () => {
    const { username, tag } = this.props;
    ListingActions.clearUserPosts();
    if (tag) {
      try {
        await ProfileActions.getTagInfo(tag);
      } catch (e) {
        console.log(e);
      }
    }
    const { rawTagName } = this.props;
    ListingActions.getUserPosts({ username, tag: rawTagName || undefined });
  };
  componentDidMount() {
    this.initialize();
    this.listenScroll();
  }
  componentWillUnmount() {
    this.unlistenScroll();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tag !== this.props.tag || prevProps.username !== this.props.username) {
      this.initialize();
    }
  }

  prefetch = async () => {
    const { prefetched, hasEnded, posts, prefetching, loading, username, tag } = this.props;
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
        tag,
        cursor: lastId,
      });
      preventStickBottom();
    } catch (e) {
      console.log(e);
    }
  };

  onScroll = throttle(() => {
    const scrollBottom = getScrollBottom();
    if (scrollBottom > 1000) return;
    this.prefetch();
  }, 100);

  listenScroll = () => {
    window.addEventListener('scroll', this.onScroll);
  };

  unlistenScroll = () => {
    window.removeEventListener('scroll', this.onScroll);
  };

  render() {
    const { posts, loading, prefetching } = this.props;
    return (
      <PostCardList
        posts={posts}
        oneColumn
        loading={loading}
        prefetching={prefetching}
        hasEnded={false}
      />
    );
  }
}

export default connect(
  ({ listing, pender, profile }: State) => ({
    posts: listing.user.posts,
    prefetched: listing.user.prefetched,
    hasEnded: listing.user.end,
    prefetching: pender.pending['listing/PREFETCH_USER_POSTS'],
    loading: pender.pending['listing/GET_USER_POSTS'],
    rawTagName: profile.rawTagName,
  }),
  () => ({}),
)(UserPosts);
