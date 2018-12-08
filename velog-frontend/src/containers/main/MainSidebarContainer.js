// @flow

import React, { Component } from 'react';
import MainSidebar from 'components/main/MainSidebar/MainSidebar';
import { withRouter, type Match } from 'react-router-dom';
import { compose } from 'redux';
import MainSearchBox from 'components/main/MainSearchBox';

type Props = {
  match: Match,
};

class MainSidebarContainer extends Component<Props> {
  render() {
    const { match } = this.props;

    return <MainSidebar url={this.props.match.url} searchBox={<MainSearchBox />} />;
  }
}

export default withRouter(MainSidebarContainer);
