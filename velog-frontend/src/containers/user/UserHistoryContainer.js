// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ProfileActions } from 'store/actionCreators';
import UserHistory from 'components/user/UserHistory/UserHistory';
import { withRouter, type ContextRouter } from 'react-router-dom';
import { compose } from 'redux';
import { type State } from 'store';
import { type UserHistoryItem } from 'store/modules/profile';

type Props = {
  userHistory: ?(UserHistoryItem[]),
} & ContextRouter;
class UserHistoryContainer extends Component<Props> {
  initialize = async () => {
    const { match } = this.props;
    const { username } = match.params;
    try {
      if (!username) return;
      await ProfileActions.getUserHistory(username);
    } catch (e) {
      console.log(e);
    }
  };
  componentDidMount() {
    ProfileActions.setSideVisibility(false);
    this.initialize();
  }
  componentWillUnmount() {
    ProfileActions.setSideVisibility(true);
  }

  render() {
    const { userHistory, match } = this.props;
    if (!userHistory) return null;
    return <UserHistory data={userHistory} username={match.params.username || ''} />;
  }
}

const enhance = compose(
  withRouter,
  connect(
    ({ profile }: State) => ({
      userHistory: profile.userHistory,
    }),
    () => ({}),
  ),
);

export default enhance(UserHistoryContainer);
