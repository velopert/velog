// @flow
import React, { Component } from 'react';
import { ProfileActions } from 'store/actionCreators';
import { withRouter, type ContextRouter } from 'react-router-dom';
import UserSeriesList from 'components/user/UserSeriesList/UserSeriesList';
import { type State } from 'store';
import { connect } from 'react-redux';
import { type SeriesItemData } from 'store/modules/profile';

type Props = {
  seriesList: ?(SeriesItemData[]),
  shouldCancel: boolean,
} & ContextRouter;
class UserSeriesContainer extends Component<Props> {
  initialize = async () => {
    if (this.props.shouldCancel) return;
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
    const { seriesList } = this.props;
    if (!seriesList) return null;
    return <UserSeriesList seriesList={seriesList} />;
  }
}

export default connect((state: State) => ({
  seriesList: state.profile.seriesList,
  shouldCancel: state.common.ssr && !state.common.router.altered,
}))(withRouter(UserSeriesContainer));
