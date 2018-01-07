import React, { Component } from 'react';
import UserButton from 'components/base/UserButton';
import { BaseActions } from 'store/actionCreators';

class UserButtonContainer extends Component {
  onClick = () => {
    BaseActions.showUserMenu();
  }

  render() {
    const { onClick } = this;
    return (
      <UserButton onClick={onClick} />
    );
  }
}

export default UserButtonContainer;