// @flow
import React, { Component } from 'react';
import WriteExtra from 'components/write/WriteExtra/WriteExtra';
import { connect } from 'react-redux';
import type { State } from 'store';
import { WriteActions } from 'store/actionCreators';
import type { PostData, BriefTempSaveInfo } from 'store/modules/write';
import WriteExtraTempSaveList from 'components/write/WriteExtraTempSaveList';

type Props = {
  visible: boolean,
  mode: string,
  postData: ?PostData,
  tempSaves: ?(BriefTempSaveInfo[]),
  title: string,
  body: string,
  changed: boolean,
};

class WriteExtraContainer extends Component<Props> {
  async listTempSave() {
    const { postData } = this.props;
    if (!postData) return;
    WriteActions.listTempSaves(postData.id);
  }

  tempSave = async () => {
    const { postData, title, body, changed } = this.props;

    if (!changed) return;

    try {
      if (postData) {
        await WriteActions.tempSave({ title, body, postId: postData.id });
      }
    } catch (e) {
      console.log(e);
    }
  };

  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      // WriteExtra is now visible
      this.listTempSave();
    }
  }

  onSelectLayoutMode = (mode) => {
    WriteActions.setLayoutMode(mode);
  };
  onClickOutside = (e: SyntheticMouseEvent<any>) => {
    if (!this.props.visible) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    WriteActions.hideWriteExtra();
  };

  onLoadTempSave = async (id: string) => {
    const { postData } = this.props;
    if (!postData) return;
    await this.tempSave();
    await WriteActions.loadTempSave({
      postId: postData.id,
      saveId: id,
    });
  };

  render() {
    const { mode, tempSaves } = this.props;
    return (
      <WriteExtra
        eventTypes={['click', 'touchend']}
        visible={this.props.visible}
        onSelectLayoutMode={this.onSelectLayoutMode}
        onClickOutside={this.onClickOutside}
        tempSaveList={
          <WriteExtraTempSaveList tempSaves={tempSaves} onLoadTempSave={this.onLoadTempSave} />
        }
        mode={mode}
      />
    );
  }
}

export default connect(
  ({ write, base }: State) => ({
    visible: write.writeExtra.visible,
    mode: write.writeExtra.layoutMode,
    postData: write.postData,
    tempSaves: write.tempSaves,
    title: write.title,
    body: write.body,
    changed: write.changed,
  }),
  () => ({}),
)(WriteExtraContainer);
