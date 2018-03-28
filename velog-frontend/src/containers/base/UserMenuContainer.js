// @flow
import React, { Component } from 'react';
import UserMenu from 'components/base/UserMenu';
import withClickOutside from 'react-onclickoutside';
import { connect } from 'react-redux';
import type { State } from 'store';
import { BaseActions, UserActions } from 'store/actionCreators';
import storage, { keys } from 'lib/storage';

type Props = {
  visible: boolean,
  username: string,
};

class UserMenuContainer extends Component<Props> {
  onClickOutside = (e) => {
    BaseActions.hideUserMenu();
  }

  onClick = () => {
    BaseActions.hideUserMenu();
  }

  onLogout = async () => {
    try {
      await UserActions.logout();
    } catch (e) {
      console.log(e);
    }
    storage.remove(keys.user);
    window.location.href = '/';
  }

  render() {
    const { visible, username } = this.props;
    const { onClickOutside, onClick, onLogout } = this;
    if (!visible) return null;

    return (
      <UserMenu
        username={username}
        onClickOutside={onClickOutside}
        onClick={onClick}
        onLogout={onLogout}
        eventTypes={['click', 'touchend']}
      />
    );
  }
}

export default connect(
  ({ base, user }: State) => ({
    visible: base.userMenu,
    username: user.user && user.user.username,
  }),
  () => ({}),
)(UserMenuContainer);