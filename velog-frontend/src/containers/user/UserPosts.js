// @flow
import React, { Component, Fragment } from 'react';
import PostCardList from 'components/common/PostCardList/PostCardList';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { ListingActions, ProfileActions } from 'store/actionCreators';
import type { State } from 'store';
import type { PostItem } from 'store/modules/listing';
import throttle from 'lodash/throttle';
import { getScrollBottom, preventStickBottom } from 'lib/common';
import { type Profile } from 'store/modules/profile';
import UserPostCardList from 'components/user/UserPostCardList';
import { Helmet } from 'react-helmet';

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
  shouldCancel: boolean,
  profile: ?Profile,
  currentUsername: ?string,
  currentTag: ?string,
};

type UserPostsState = {
  loading: boolean,
};

class UserPosts extends Component<Props, UserPostsState> {
  prevCursor: ?string = null;

  state = {
    loading: false,
  };

  initialize = async () => {
    const { username, tag, shouldCancel, profile, posts, currentUsername, currentTag } = this.props;
    if (
      currentUsername === username && // check username
      posts && // check post length
      posts.length > 0 &&
      (tag === currentTag || (!tag && !currentTag)) // tag equals (or both undefined/null)
    ) {
      return;
    }
    if (!profile) return;
    if (!shouldCancel) {
      ListingActions.clearUserPosts();
      this.setState({ loading: true });
      if (tag) {
        try {
          await ProfileActions.getTagInfo(tag);
        } catch (e) {
          this.setState({ loading: false });
          console.log(e);
        }
      }
      const { rawTagName } = this.props;
      try {
        await ListingActions.getUserPosts({
          username,
          tag: tag ? rawTagName || undefined : undefined,
        });
        this.setState({ loading: false });
      } catch (e) {
        this.setState({ loading: false });
        console.log(e);
      }
    }
    this.prefetch();
  };
  componentDidMount() {
    this.initialize();
    this.listenScroll();
  }
  componentWillUnmount() {
    this.unlistenScroll();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tag !== this.props.tag || prevProps.profile !== this.props.profile) {
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
    const { posts, loading, prefetching, profile, rawTagName } = this.props;

    if (!posts) {
      // TODO: Show placeholder
      return <UserPostCardList.Placeholder />;
    }

    return (
      <Fragment>
        {rawTagName ? (
          <Helmet>
            <meta
              name="description"
              content={`${this.props.username}님이 작성하신 #${rawTagName} 관련 포스트 ${
                posts.length
              }개를 읽어보세요.`}
            />
          </Helmet>
        ) : null}
        <UserPostCardList posts={posts} username={this.props.username} />
      </Fragment>
    );
  }
}

export default connect(
  ({ listing, pender, profile, common }: State) => ({
    posts: listing.user.posts,
    prefetched: listing.user.prefetched,
    hasEnded: listing.user.end,
    prefetching: pender.pending['listing/PREFETCH_USER_POSTS'],
    loading: pender.pending['listing/GET_USER_POSTS'] || pender.pending['profile/GET_TAG_INFO'],
    rawTagName: profile.rawTagName,
    shouldCancel: common.ssr && !common.router.altered,
    profile: profile.profile,
    currentUsername: listing.user.currentUsername,
    currentTag: listing.user.currentTag,
  }),
  () => ({}),
)(UserPosts);
