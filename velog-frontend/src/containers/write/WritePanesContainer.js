// @flow
import React, { Component, Fragment, type Node } from 'react';
import WritePanes from 'components/write/WritePanes';
import type { State } from 'store';
import { WriteActions } from 'store/actionCreators';
import { connect } from 'react-redux';
import CodeEditorContainer from 'containers/write/CodeEditorContainer';
import MarkdownPreviewContainer from 'containers/write/MarkdownPreviewContainer';
import WriteMobileTitleContainer from './WriteMobileTitleContainer';

type Props = {
  mode: string,
  width: number,
};

class WritePanesContainer extends Component<Props> {
  componentWillUnmount() {
    WriteActions.reset(); // reset Write Module on page leave
  }
  onSetLayoutMode = (mode) => {
    WriteActions.setLayoutMode(mode);
  };
  constructor(props) {
    super(props);
    if (typeof window === 'undefined') return;
    const width = window.outerWidth;
    if (width < 1024) {
      WriteActions.setLayoutMode('editor');
    }
  }
  render() {
    return (
      <WritePanes
        left={
          <Fragment>
            <WriteMobileTitleContainer />
            <CodeEditorContainer />
          </Fragment>
        }
        right={<MarkdownPreviewContainer />}
        mode={this.props.mode}
        onSetLayoutMode={this.onSetLayoutMode}
      />
    );
  }
}

export default connect(
  ({ write, base }: State) => ({
    mode: write.writeExtra.layoutMode,
    width: base.windowWidth,
  }),
  () => ({}),
)(WritePanesContainer);
