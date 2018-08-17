// @flow
import React, { Component } from 'react';
import MainTemplate from 'components/main/MainTemplate';
import MainTab from 'components/main/MainTab';
import { connect } from 'react-redux';
import type { State } from 'store';
import Posts from 'pages/Posts';
import Trending from 'pages/Trending';
import MainHead from 'components/main/MainHead';
import { Switch, Route, withRouter, type ContextRouter } from 'react-router-dom';
import { compose } from 'redux';
import Recent from 'pages/Recent';
import MainMobileHead from 'components/main/MainMobileHead';
import MainSidebarContainer from './MainSidebarContainer';
import MainHeadContainer from './MainHeadContainer';
import Tags from '../../pages/Tags';

type Props = {
  landing: boolean,
} & ContextRouter;

class MainContainer extends Component<Props> {
  render() {
    if (this.props.landing) return null;
    return (
      <MainTemplate sidebar={<MainSidebarContainer />}>
        <MainHeadContainer />
        <MainMobileHead url={this.props.match.url} />
        <Switch>
          <Route exact path="/(|trending)" component={Trending} />
          <Route path="/recent" component={Recent} />
          <Route path="/tags/:tag?" component={Tags} />
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
