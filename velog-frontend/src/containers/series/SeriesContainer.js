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
  shouldCancel: boolean,
} & ContextRouter;

class SeriesContainer extends Component<Props> {
  initialize = async () => {
    if (!this.props.shouldCancel) return;
    SeriesActions.initialize();
    const { username, urlSlug } = this.props.match.params;
    if (!username || !urlSlug) return;
    try {
      await SeriesActions.getSeries({
        username,
        urlSlug,
      });
    } catch (e) {
      console.log(e);
    }
  };

  enableEditing = () => {
    SeriesActions.enableEditing();
  };

  cancelEditing = () => {
    SeriesActions.disableEditing();
  };

  updateSeries = async (data: { name: string, posts: any[] }) => {
    const { username, urlSlug } = this.props.match.params;
    if (!username || !urlSlug) return;
    try {
      await SeriesActions.updateSeries({
        username,
        urlSlug,
        data: {
          ...data,
          description: '',
          thumbnail: null,
          url_slug: urlSlug,
        },
      });
      await this.initialize();
      SeriesActions.disableEditing();
    } catch (e) {
      console.log(e);
    }
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
          <SeriesEditor
            series={series}
            onCancel={this.cancelEditing}
            onUpdate={this.updateSeries}
          />
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
    shouldCancel: state.common.ssr && !state.common.router.altered,
  }))(SeriesContainer),
);
