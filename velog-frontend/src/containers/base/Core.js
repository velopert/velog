// @flow
import React, { Component, Fragment } from 'react';
import { UserActions, BaseActions } from 'store/actionCreators';
import { connect } from 'react-redux';
import type { State } from 'store';
import type { UserData } from 'store/modules/user';
import storage from 'lib/storage';
import NanoBar from 'components/common/NanoBar';
import throttle from 'lodash/throttle';
import FullscreenLoaderContainer from './FullscreenLoaderContainer';

type Props = {
  user: ?UserData,
};

class Core extends Component<Props> {
  checkUser = async () => {
    const storedUser = storage.get('__velog_user__');
    if (!storedUser) {
      UserActions.processUser();
      return;
    }
    BaseActions.exitLanding();
    UserActions.setUser(storedUser);
    try {
      await UserActions.checkUser();
    } catch (e) {
      storage.remove('__velog__user__');
    }
  };

  constructor(props) {
    super(props);
    this.setWidth();
  }

  setWidth = () => {
    if (typeof window === 'undefined') return;
    BaseActions.setWidth(window.outerWidth);
  };

  onResize = throttle(() => {
    this.setWidth();
  }, 250);

  initialize = async () => {
    this.checkUser();
    window.addEventListener('resize', this.onResize);
  };

  integrateAxiosProgressbar = () => {
    // TODO
  };

  componentDidMount() {
    this.initialize();
    this.integrateAxiosProgressbar();
  }

  render() {
    return (
      <Fragment>
        <FullscreenLoaderContainer />
        <NanoBar />
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
