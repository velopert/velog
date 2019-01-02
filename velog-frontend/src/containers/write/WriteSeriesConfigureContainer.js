// @flow
import React, { Component } from 'react';
import { WriteActions } from 'store/actionCreators';
import { connect } from 'react-redux';
import type { State } from 'store';
import WriteSeriesConfigure from '../../components/write/WriteSeriesConfigure/WriteSeriesConfigure';

type Props = {
  series: ?{ id: string, name: string },
};

class WriteSeriesConfigureContainer extends Component<Props> {
  onOpenModal = () => {
    WriteActions.toggleSeriesMode();
  };
  render() {
    const { series } = this.props;
    return <WriteSeriesConfigure series={series} onOpenModal={this.onOpenModal} />;
  }
}

export default connect((state: State) => ({
  series: state.write.submitBox.series,
}))(WriteSeriesConfigureContainer);
