// @flow
import React, { Component, Fragment } from 'react';
import type { State } from 'store';
import { connect } from 'react-redux';
import UserButton from 'components/base/UserButton';
import { BaseActions, UserActions } from 'store/actionCreators';
import withUser, { type WithUserProps } from 'lib/hoc/withUser';
import { compose } from 'redux';
import NotificationButton from '../../components/base/NotificationButton/NotificationButton';
import UserMenuContainer from './UserMenuContainer';

type Props = {} & WithUserProps;
class RightCorner extends Component<Props> {
  onUserButtonClick = () => {
    BaseActions.showUserMenu();
  };

  render() {
    const { user } = this.props;
    if (!user) return null;
    return (
      <Fragment>
        {/* <NotificationButton count={10} onClick={() => undefined} /> */}
        <UserButton onClick={this.onUserButtonClick} thumbnail={user.thumbnail} />
        <UserMenuContainer />
      </Fragment>
    );
  }
}

export default compose(withUser, connect((state: State) => ({}), () => ({})))(RightCorner);
