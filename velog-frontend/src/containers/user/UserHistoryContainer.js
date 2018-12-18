// @flow
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { ProfileActions } from 'store/actionCreators';
import UserHistory from 'components/user/UserHistory/UserHistory';
import { withRouter, type ContextRouter } from 'react-router-dom';
import { compose } from 'redux';
import { type State } from 'store';
import { type UserHistoryItem, type Profile } from 'store/modules/profile';
import throttle from 'lodash/throttle';
import { getScrollBottom, preventStickBottom } from 'lib/common';
import { Helmet } from 'react-helmet';

type Props = {
  userHistory: ?(UserHistoryItem[]),
  prefetched: ?(UserHistoryItem[]),
  prefetching: boolean,
  loading: boolean,
  historyEnd: boolean,
  profile: ?Profile,
  shouldCancel: boolean,
} & ContextRouter;
class UserHistoryContainer extends Component<Props> {
  lastOffset: ?number;
  initialize = async () => {
    const { match, profile, shouldCancel, userHistory } = this.props;
    const { username } = match.params;
    try {
      if (!username) return;
      if (username === (profile && profile.username) && userHistory) return;
      if (!shouldCancel) {
        await ProfileActions.getUserHistory({ username });
      }
      this.prefetch();
    } catch (e) {
      console.log(e);
    }
  };

  listenScroll = () => {
    window.addEventListener('scroll', this.onScroll);
  };

  unlistenScroll = () => {
    window.removeEventListener('scroll', this.onScroll);
  };

  prefetch = async () => {
    const { userHistory, prefetched, loading, prefetching, match, historyEnd } = this.props;
    const { username } = match.params;
    if (!username || !userHistory || loading || prefetching) return;
    if ((!prefetched || prefetched.length === 0) && historyEnd) return;

    // REVEAL
    ProfileActions.revealPrefetchedHistory();
    await Promise.resolve();
    try {
      await ProfileActions.prefetchUserHistory({
        username,
        offset: userHistory.length || 0,
      });
      this.onScroll();
      preventStickBottom();
    } catch (e) {
      console.log(e);
    }
  };

  onScroll = throttle(() => {
    const scrollBottom = getScrollBottom();
    if (scrollBottom > 1000) return;
    this.prefetch();
  }, 250);

  componentDidMount() {
    ProfileActions.setSideVisibility(false);
    this.initialize();
    this.listenScroll();
  }
  componentWillUnmount() {
    ProfileActions.setSideVisibility(true);
    this.unlistenScroll();
  }

  render() {
    const { profile, userHistory, match, loading, prefetching } = this.props;
    return (
      <Fragment>
        {profile && (
          <Helmet>
            <title>{`${profile.username} (${profile.display_name}) 활동 기록 | velog`}</title>
            <meta
              name="description"
              content={`${profile.username}님이 벨로그에서 관심 있어 한 포스트들을 확인하세요.`}
            />
          </Helmet>
        )}
        <UserHistory
          data={userHistory}
          username={match.params.username || ''}
          loading={loading || prefetching}
        />
      </Fragment>
    );
  }
}

const enhance = compose(
  withRouter,
  connect(
    ({ profile, pender, common }: State) => ({
      userHistory: profile.userHistory,
      prefetched: profile.prefetchedHistory,
      loading: pender.pending['profile/GET_USER_HISTORY'],
      prefetching: pender.pending['profile/PREFETCH_USER_HISTORY'],
      historyEnd: profile.historyEnd,
      profile: profile.profile,
      shouldCancel: common.ssr && !common.router.altered,
    }),
    () => ({}),
  ),
);

export default enhance(UserHistoryContainer);
