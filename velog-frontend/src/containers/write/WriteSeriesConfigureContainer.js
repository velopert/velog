// @flow
import React, { Component } from 'react';
import WriteSeriesConfigure from '../../components/write/WriteSeriesConfigure/WriteSeriesConfigure';

type Props = {};

class WriteSeriesConfigureContainer extends Component<Props> {
  render() {
    return <WriteSeriesConfigure current={null} />;
  }
}

export default WriteSeriesConfigureContainer;
