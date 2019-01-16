// @flow
import React, { Component } from 'react';
import { withRouter, type ContextRouter } from 'react-router-dom';
import { SeriesActions } from 'store/actionCreators';
import { connect } from 'react-redux';
import { type State } from 'store';
import { type SeriesData } from 'store/modules/series';
import SeriesViewer from '../../components/series/SeriesViewer/SeriesViewer';
import SeriesEditor from '../../components/series/SeriesEditor/SeriesEditor';
import SeriesTemplate from '../../components/series/SeriesTemplate/SeriesTemplate';

type Props = {
  series: ?SeriesData,
  editing: boolean,
} & ContextRouter;

class SeriesContainer extends Component<Props> {
  initialize = () => {
    const { username, urlSlug } = this.props.match.params;
    if (!username || !urlSlug) return;
    SeriesActions.getSeries({
      username,
      urlSlug,
    });
  };

  enableEditing = () => {
    SeriesActions.enableEditing();
  };
  componentDidMount() {
    this.initialize();
  }

  render() {
    const { series, editing } = this.props;
    if (!series) return null;

    return (
      <SeriesTemplate user={series.user}>
        {editing ? (
          <SeriesEditor series={series} />
        ) : (
          <SeriesViewer series={series} onEnableEditing={this.enableEditing} />
        )}
      </SeriesTemplate>
    );
  }
}

export default withRouter(
  connect((state: State) => ({
    series: state.series.series,
    editing: state.series.editing,
  }))(SeriesContainer),
);
