// @flow
import React, { Component } from 'react';
import { withRouter, type ContextRouter } from 'react-router-dom';
import { SeriesActions } from 'store/actionCreators';
import { connect } from 'react-redux';
import { type State } from 'store';
import QuestionModal from 'components/common/QuestionModal/QuestionModal';
import { type SeriesData } from 'store/modules/series';
import SeriesViewer from '../../components/series/SeriesViewer/SeriesViewer';
import SeriesEditor from '../../components/series/SeriesEditor/SeriesEditor';
import SeriesTemplate from '../../components/series/SeriesTemplate/SeriesTemplate';

type Props = {
  series: ?SeriesData,
  editing: boolean,
  shouldCancel: boolean,
  currentUsername: ?string,
} & ContextRouter;

type LocalState = {
  remove: boolean,
};

class SeriesContainer extends Component<Props, LocalState> {
  state = {
    remove: false,
  };
  initialize = async () => {
    if (this.props.shouldCancel) return;
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

  askRemoveSeries = () => {
    this.setState({
      remove: true,
    });
  };

  cancelRemove = () => {
    this.setState({
      remove: false,
    });
  };

  confirmRemove = () => {
    const { username, urlSlug } = this.props.match.params;
    if (!username || !urlSlug) return;
    SeriesActions.removeSeries({
      username,
      urlSlug,
    });
    this.props.history.push(`/@${this.props.currentUsername || ''}`);
  };
  componentDidMount() {
    this.initialize();
  }

  render() {
    const { series, editing, currentUsername } = this.props;
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
          <SeriesViewer
            series={series}
            onAskRemove={this.askRemoveSeries}
            onEnableEditing={this.enableEditing}
            ownSeries={currentUsername === series.user.username}
          />
        )}
        <QuestionModal
          title="시리즈 삭제"
          description="시리즈를 삭제하시겠습니까?"
          confirmText="삭제"
          open={this.state.remove}
          onCancel={this.cancelRemove}
          onConfirm={this.confirmRemove}
        />
      </SeriesTemplate>
    );
  }
}

export default withRouter(
  connect((state: State) => ({
    series: state.series.series,
    editing: state.series.editing,
    shouldCancel: state.common.ssr && !state.common.router.altered,
    currentUsername: state.user.user && state.user.user.username,
  }))(SeriesContainer),
);
