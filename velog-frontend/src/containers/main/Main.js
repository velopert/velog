// @flow
import React, { Component } from 'react';
import MainTemplate from 'components/main/MainTemplate';
import MainTab from 'components/main/MainTab';
import { connect } from 'react-redux';
import type { State } from 'store';
import MainHead from 'components/main/MainHead';
import MainSidebarContainer from './MainSidebarContainer';
import MainHeadContainer from './MainHeadContainer';

type Props = {
  landing: boolean,
};

class MainContainer extends Component<Props> {
  render() {
    if (this.props.landing) return null;
    return (
      <MainTemplate sidebar={<MainSidebarContainer />}>
        <MainHeadContainer />
      </MainTemplate>
    );
  }
}

export default connect(
  ({ base }: State) => ({
    landing: base.landing,
  }),
  () => ({}),
)(MainContainer);
