// @flow
import React, { Component } from 'react';
import { withRouter, type ContextRouter } from 'react-router-dom';
import { SeriesActions } from 'store/actionCreators';
import { connect } from 'react-redux';
import { type State } from 'store';
import { type SeriesData } from 'store/modules/series';
import SeriesViewer from '../../components/series/SeriesViewer/SeriesViewer';

type Props = {
  series: ?SeriesData,
} & ContextRouter;

class SeriesViewerContainer extends Component<Props> {
  initialize = () => {
    const { username, urlSlug } = this.props.match.params;
    if (!username || !urlSlug) return;
    SeriesActions.getSeries({
      username,
      urlSlug,
    });
  };
  componentDidMount() {
    this.initialize();
  }

  render() {
    const { series } = this.props;
    if (!series) return null;
    return <SeriesViewer series={series} />;
  }
}

export default withRouter(
  connect((state: State) => ({
    series: state.series.series,
  }))(SeriesViewerContainer),
);
