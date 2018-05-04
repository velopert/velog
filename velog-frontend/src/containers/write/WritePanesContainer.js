// @flow
import React, { Component, type Node } from 'react';
import WritePanes from 'components/write/WritePanes';
import type { State } from 'store';
import { WriteActions } from 'store/actionCreators';
import { connect } from 'react-redux';
import CodeEditorContainer from 'containers/write/CodeEditorContainer';
import MarkdownPreviewContainer from 'containers/write/MarkdownPreviewContainer';

type Props = {
  mode: string,
};

class WritePanesContainer extends Component<Props> {
  render() {
    return (
      <WritePanes
        left={<CodeEditorContainer />}
        right={<MarkdownPreviewContainer />}
        mode={this.props.mode}
      />
    );
  }
}

export default connect(
  ({ write }: State) => ({
    mode: write.writeExtra.layoutMode,
  }),
  () => ({}),
)(WritePanesContainer);
