// @flow
import React, { Component, Fragment } from 'react';
import { ListingActions, CommonActions } from 'store/actionCreators';
import type { State } from 'store';
import { connect } from 'react-redux';
import SavePostCardList from 'components/saves/SavePostCardList/SavePostCardList';
import type { PostItem } from 'store/modules/listing';
import throttle from 'lodash/throttle';
import { getScrollBottom, preventStickBottom } from 'lib/common';
import QuestionModal from 'components/common/QuestionModal/QuestionModal';

type Props = {
  username: ?string,
  posts: ?(PostItem[]),
  prefetched: ?(PostItem[]),
  prefetching: boolean,
  loading: boolean,
  hasEnded: boolean,
  removeId: ?string,
  ask: boolean,
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

  prefetch = async () => {
    const { posts, prefetching, loading, hasEnded, prefetched, username } = this.props;
    if (loading || prefetching || !posts || !username) return;
    if (posts.length === 0) return;
    const { id: lastId } = posts[posts.length - 1];
    if (prefetched) {
      ListingActions.revealPrefetched('temp');
      await Promise.resolve();
    }

    if (lastId === this.prevCursor) return;
    this.prevCursor = lastId;

    if (hasEnded) return;
    try {
      await ListingActions.prefetchTempPosts({
        cursor: lastId,
        username,
      });
    } catch (e) {
      console.log(e);
    }
    preventStickBottom();
    this.onScroll();
  };

  onScroll = throttle(() => {
    const scrollBottom = getScrollBottom();
    if (scrollBottom > 1000) return;
    this.prefetch();
  }, 250);

  onAskRemove = (postId: string) => {
    CommonActions.askRemove(postId);
  };

  onConfirmRemove = async () => {
    const { removeId } = this.props;
    if (!removeId) return;
    CommonActions.removePost(removeId);
    ListingActions.removeTempPost(removeId);
    CommonActions.closeRemove();
  };

  onCancelRemove = () => {
    CommonActions.closeRemove();
  };

  render() {
    const { posts, ask } = this.props;
    return (
      <Fragment>
        <SavePostCardList posts={posts} onAskRemove={this.onAskRemove} />
        <QuestionModal
          open={ask}
          title="임시 글 삭제"
          description="이 포스트를 정말로 삭제하시겠습니까?"
          confirmText="삭제"
          onConfirm={this.onConfirmRemove}
          onCancel={this.onCancelRemove}
        />
      </Fragment>
    );
  }
}

export default connect(
  ({ user, listing, pender, common }: State) => ({
    username: user.user && user.user.username,
    posts: listing.temp.posts,
    prefetched: listing.temp.prefetched,
    prefetching: pender.pending['listing/PREFETCH_TEMP_POSTS'],
    loading: pender.pending['listing/GET_TEMP_POSTS'],
    hasEnded: listing.temp.end,
    removeId: common.saves.removeId,
    ask: common.saves.ask,
  }),
  () => ({}),
)(SavePostCardListContainer);
