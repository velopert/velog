// @flow
import React, { Component } from 'react';
import WriteExtra from 'components/write/WriteExtra/WriteExtra';
import { connect } from 'react-redux';
import type { State } from 'store';

type Props = {
  visible: boolean,
};
class WriteExtraContainer extends Component<Props> {
  render() {
    return <WriteExtra visible={this.props.visible} />;
  }
}

export default connect(
  ({ write }: State) => ({
    visible: write.writeExtra.visible,
  }),
  () => ({}),
)(WriteExtraContainer);
