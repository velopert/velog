// @flow
import React, { Component } from 'react';
import WriteExtra from 'components/write/WriteExtra/WriteExtra';
import { connect } from 'react-redux';
import type { State } from 'store';
import { WriteActions } from 'store/actionCreators';

type Props = {
  visible: boolean,
  mode: string,
};
class WriteExtraContainer extends Component<Props> {
  onSelectLayoutMode = (mode) => {
    WriteActions.setLayoutMode(mode);
  };
  onClickOutside = () => {
    if (!this.props.visible) {
      return;
    }
    WriteActions.hideWriteExtra();
  };
  render() {
    const { mode } = this.props;
    return (
      <WriteExtra
        visible={this.props.visible}
        onSelectLayoutMode={this.onSelectLayoutMode}
        onClickOutside={this.onClickOutside}
        mode={mode}
      />
    );
  }
}

export default connect(
  ({ write }: State) => ({ visible: write.writeExtra.visible, mode: write.writeExtra.layoutMode }),
  () => ({}),
)(WriteExtraContainer);
