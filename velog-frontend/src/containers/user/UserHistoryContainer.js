// @flow
import React, { Component } from 'react';
import { ProfileActions } from 'store/actionCreators';
import UserHistory from 'components/user/UserHistory/UserHistory';

type Props = {};
class UserHistoryContainer extends Component<Props> {
  componentDidMount() {
    console.log('helloworld');
    ProfileActions.setSideVisibility(false);
  }
  componentWillUnmount() {
    ProfileActions.setSideVisibility(true);
  }

  render() {
    return <UserHistory />;
  }
}

export default UserHistoryContainer;
