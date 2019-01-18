// @flow
import React, { Component } from 'react';
import { WriteActions } from 'store/actionCreators';
import { connect } from 'react-redux';
import { type State } from 'store';
import { type SeriesItemData } from 'store/modules/write';
import SubmitBoxSeries from '../../components/write/SubmitBoxSeries/SubmitBoxSeries';

type Props = {
  username: ?string,
  list: ?(SeriesItemData[]),
  series: ?{ id: string, name: string },
};

class SubmitBoxSeriesContainer extends Component<Props> {
  initialize = () => {
    if (!this.props.username) return;
    WriteActions.getSeriesList(this.props.username);
  };
  componentDidMount() {
    this.initialize();
  }

  onCreateSeries = async (payload: { name: string, urlSlug: string }) => {
    try {
      await WriteActions.createSeries({
        name: payload.name,
        description: '',
        url_slug: payload.urlSlug,
        posts: [],
        thumbnail: null,
      });
      this.initialize();
    } catch (e) {
      console.log(e);
    }
  };

  onSelectSeries = (index: number) => {
    const { list } = this.props;
    if (!list) return;
    const series = list[index];
    WriteActions.selectSeries(
      series
        ? {
          id: series.id,
          name: series.name,
        }
        : null,
    );
    WriteActions.toggleSeriesMode();
  };

  onClose = () => {
    WriteActions.toggleSeriesMode();
  };

  render() {
    const { list, series } = this.props;
    return (
      <SubmitBoxSeries
        series={series}
        onCreateSeries={this.onCreateSeries}
        list={list}
        onSelectSeries={this.onSelectSeries}
        onClose={this.onClose}
      />
    );
  }
}

export default connect((state: State) => ({
  username: state.user.user && state.user.user.username,
  list: state.write.seriesModal.list,
  series: state.write.submitBox.series,
}))(SubmitBoxSeriesContainer);
