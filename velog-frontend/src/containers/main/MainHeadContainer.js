// @flow
import React, { Component, Fragment } from 'react';
import MainHead from 'components/main/MainHead';
import { BaseActions } from 'store/actionCreators';
import withUser from 'lib/hoc/withUser';
import type { UserData } from 'store/modules/user';
import MainHeadUserButton from 'components/main/MainHeadUserButton';
import MainHeadNotifButton from 'components/main/MainHeadNotifButton/MainHeadNotifButton';

type Props = {
  user: ?UserData,
};

class MainHeadContainer extends Component<Props> {
  onEnterLanding = () => {
    BaseActions.enterLanding();
  };

  onUserButtonClick = () => {};

  render() {
    const { onEnterLanding, onUserButtonClick } = this;
    const { user } = this.props;

    return (
      <MainHead
        onLogin={onEnterLanding}
        logged={!!user}
        rightArea={
          user && (
            <Fragment>
              <MainHeadNotifButton count={10} onClick={() => undefined} />
              <MainHeadUserButton onClick={onUserButtonClick} thumbnail={user.thumbnail} />
            </Fragment>
          )
        }
      />
    );
  }
}

export default withUser(MainHeadContainer);
