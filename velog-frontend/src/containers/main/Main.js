// @flow
import React, { Component } from 'react';
import MainTemplate from 'components/main/MainTemplate';
import MainTab from 'components/main/MainTab';
import { connect } from 'react-redux';
import type { State } from 'store';

type Props = {
  landing: boolean,
};

class MainContainer extends Component<Props> {
  render() {
    if (this.props.landing) return null;
    return <MainTemplate tab={<MainTab />}>작은 물고기가뭐지</MainTemplate>;
  }
}

export default connect(
  ({ base }: State) => ({
    landing: base.landing,
  }),
  () => ({}),
)(MainContainer);
