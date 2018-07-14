// @flow
import React, { Component } from 'react';
import WriteExtra from 'components/write/WriteExtra/WriteExtra';
import { connect } from 'react-redux';
import type { State } from 'store';
import { WriteActions } from 'store/actionCreators';
import type { PostData } from 'store/modules/write';

type Props = {
  visible: boolean,
  mode: string,
  postData: ?PostData,
};

class WriteExtraContainer extends Component<Props> {
  async listTempSave() {
    const { postData } = this.props;
    if (!postData) return;
    WriteActions.listTempSaves(postData.id);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      // WriteExtra is now visible
      this.listTempSave();
    }
  }

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
  ({ write }: State) => ({
    visible: write.writeExtra.visible,
    mode: write.writeExtra.layoutMode,
    postData: write.postData,
  }),
  () => ({}),
)(WriteExtraContainer);
