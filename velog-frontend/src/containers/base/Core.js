// @flow
import React, { Component, Fragment } from 'react';
import { UserActions } from 'store/actionCreators';
import { connect } from 'react-redux';
import type { State } from 'store';
import type { UserData } from 'store/modules/user';
import storage from 'lib/storage';
import FullscreenLoaderContainer from './FullscreenLoaderContainer';

type Props = {
  user: ?UserData
};

class Core extends Component<Props> {
  checkUser = async () => {
    const storedUser = storage.get('__velog_user__');
    if (!storedUser) {
      UserActions.process();
      return;
    }
    UserActions.setUser(storedUser);
    try {
      await UserActions.checkUser();
    } catch (e) {
      storage.remove('__velog__user__');
    }
  }

  initialize = async () => {
    this.checkUser();
  }

  componentDidMount() {
    this.initialize();
  }

  render() {
    return (
      <Fragment>
        <FullscreenLoaderContainer />
      </Fragment>
    );
  }
}

export default connect(
  ({ user }: State) => ({
    user: user.user,
  }),
  () => ({}),
)(Core);
