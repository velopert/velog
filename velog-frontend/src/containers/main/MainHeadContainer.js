// @flow
import React, { Component } from 'react';
import MainHead from 'components/main/MainHead';
import { BaseActions } from 'store/actionCreators';

type Props = {};
class MainHeadContainer extends Component<Props> {
  onEnterLanding = () => {
    BaseActions.enterLanding();
  };

  render() {
    const { onEnterLanding } = this;
    return <MainHead onLogin={onEnterLanding} />;
  }
}

export default MainHeadContainer;
