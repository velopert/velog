// @flow
import React, { Component } from 'react';
import UserButton from 'components/base/UserButton';
import { BaseActions } from 'store/actionCreators';
import { connect } from 'react-redux';
import type { State } from 'store';

type Props = {
  thumbnail: string
}

class UserButtonContainer extends Component<Props> {
  onClick = () => {
    BaseActions.showUserMenu();
  }

  render() {
    const { onClick } = this;
    const { thumbnail } = this.props;
    return (
      <UserButton onClick={onClick} thumbnail={thumbnail} />
    );
  }
}

export default connect(
  ({ user }: State) => ({
    thumbnail: user.user && user.user.thumbnail,
  }),
  () => ({}),
)(UserButtonContainer);