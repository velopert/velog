// @flow
import React, { Component } from 'react';
import { WriteActions } from 'store/actionCreators';
import WriteSeriesConfigure from '../../components/write/WriteSeriesConfigure/WriteSeriesConfigure';

type Props = {};

class WriteSeriesConfigureContainer extends Component<Props> {
  onOpenModal = () => {
    WriteActions.toggleSeriesMode();
  };
  render() {
    return <WriteSeriesConfigure current={null} onOpenModal={this.onOpenModal} />;
  }
}

export default WriteSeriesConfigureContainer;
