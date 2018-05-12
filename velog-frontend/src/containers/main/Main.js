// @flow
import React, { Component } from 'react';
import MainTemplate from 'components/main/MainTemplate';
import MainTab from 'components/main/MainTab';
import { connect } from 'react-redux';
import type { State } from 'store';
import Posts from 'pages/Posts';
import MainHead from 'components/main/MainHead';
import { Switch, Route, withRouter } from 'react-router-dom';
import { compose } from 'redux';
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
        <Switch>
          <Route path="/" component={Posts} />
        </Switch>
      </MainTemplate>
    );
  }
}

export default compose(
  withRouter,
  connect(
    ({ base }: State) => ({
      landing: base.landing,
    }),
    () => ({}),
  ),
)(MainContainer);
