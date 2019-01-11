// @flow
import React, { Component } from 'react';
import { ProfileActions } from 'store/actionCreators';
import { withRouter, type ContextRouter } from 'react-router-dom';
import UserSeriesList from 'components/user/UserSeriesList/UserSeriesList';

type Props = {} & ContextRouter;
class UserSeriesContainer extends Component<Props> {
  initialize = async () => {
    const { username } = this.props.match.params;
    try {
      if (!username) return;
      await ProfileActions.getSeriesList(username);
    } catch (e) {
      console.log(e);
    }
  };
  componentDidMount() {
    ProfileActions.setSideVisibility(false);
    this.initialize();
  }

  componentWillUnmount() {
    ProfileActions.setSideVisibility(true);
  }

  render() {
    return <UserSeriesList />;
  }
}

export default withRouter(UserSeriesContainer);
