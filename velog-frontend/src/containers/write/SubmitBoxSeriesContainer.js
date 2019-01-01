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
};

class SubmitBoxSeriesContainer extends Component<Props> {
  initialize = () => {
    console.log(this.props.username);
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
  render() {
    const { list } = this.props;
    return <SubmitBoxSeries onCreateSeries={this.onCreateSeries} list={list} />;
  }
}

export default connect((state: State) => ({
  username: state.user.user && state.user.user.username,
  list: state.write.seriesModal.list,
}))(SubmitBoxSeriesContainer);
