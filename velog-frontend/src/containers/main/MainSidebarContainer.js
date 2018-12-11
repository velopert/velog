// @flow

import React, { Component } from 'react';
import MainSidebar from 'components/main/MainSidebar/MainSidebar';
import { withRouter, type Match, type ContextRouter } from 'react-router-dom';
import { compose } from 'redux';
import MainSearchBox from 'components/main/MainSearchBox';

type Props = {
  match: Match,
} & ContextRouter;

class MainSidebarContainer extends Component<Props> {
  onSearch = (keyword: string) => {
    this.props.history.push(`/search?q=${keyword}`);
  };
  render() {
    const { match } = this.props;
    return (
      <MainSidebar
        url={this.props.match.url}
        searchBox={<MainSearchBox onSearch={this.onSearch} />}
      />
    );
  }
}

export default withRouter(MainSidebarContainer);
