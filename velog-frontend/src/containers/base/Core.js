// @flow
import React, { Component, Fragment } from 'react';
import { UserActions, BaseActions, CommonActions } from 'store/actionCreators';
import { connect } from 'react-redux';
import type { State } from 'store';
import type { UserData } from 'store/modules/user';
import storage from 'lib/storage';
import NanoBar from 'components/common/NanoBar';
import throttle from 'lodash/throttle';
import { withRouter, type ContextRouter } from 'react-router-dom';

import FullscreenLoaderContainer from './FullscreenLoaderContainer';
import { setup } from '../../lib/progress';
import NotifyToastContainer from './NotifyToastContainer';

type Props = {
  user: ?UserData,
} & ContextRouter;

class Core extends Component<Props> {
  unlisten = null;

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
      storage.remove('__velog_user__');
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

  listenHistory = () => {
    const { history } = this.props;
    this.unlisten = history.listen((location, type) => {
      if (window.gtag) {
        window.gtag('config', 'UA-125599395-1', { page_path: location.pathname });
      }
      CommonActions.changeRoute({
        type,
        ...location,
      });
    });
  };

  componentDidMount() {
    this.initialize();
    this.listenHistory();
    CommonActions.changeRoute({
      type: 'PUSH',
      ...this.props.location,
    });
    setup();
  }

  componentWillUnmount() {
    if (this.unlisten) this.unlisten();
  }

  render() {
    return (
      <Fragment>
        <FullscreenLoaderContainer />
        <NanoBar />
        <NotifyToastContainer />
      </Fragment>
    );
  }
}

export default connect(
  ({ user }: State) => ({
    user: user.user,
  }),
  () => ({}),
)(withRouter(Core));
