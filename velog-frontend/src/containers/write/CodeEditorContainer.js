// @flow

import React, { Component, Fragment } from 'react';
import CodeEditor from 'components/write/CodeEditor/CodeEditor';
import FloatingImageButton from 'components/write/FloatingImageButton';
import { connect } from 'react-redux';
import type { State } from 'store';
import { WriteActions } from 'store/actionCreators';
import DropImage from 'components/write/DropImage';
import WriteUploadMask from 'components/write/WriteUploadMask';

type Props = {
  body: string,
  mask: boolean,
};

class CodeEditorContainer extends Component<Props> {
  onEditBody = (value) => {
    WriteActions.editField({
      field: 'body',
      value,
    });
  };

  onUploadClick = () => {
    const upload = document.createElement('input');
    upload.type = 'file';
    upload.onchange = (e) => {
      if (!upload.files) return;
      const file = upload.files[0];
      console.log(file);
    };
    upload.click();
  };

  onDragEnter = (e) => {
    e.preventDefault();
    setImmediate(() => {
      console.log('enter');
      WriteActions.setUploadMask(true);
    });
  };

  onDragLeave = (e) => {
    console.log(e.relatedTarget);
    e.preventDefault();
    if (!e.relatedTarget) WriteActions.setUploadMask(false);
  };

  componentWillUnmount() {
    WriteActions.reset(); // reset Write Module on page leave
  }

  render() {
    const { onEditBody, onDragEnter, onDragLeave } = this;
    const { body, mask } = this.props;

    return (
      <Fragment>
        <CodeEditor
          onEditBody={onEditBody}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          body={body}
          imageButton={<FloatingImageButton onClick={this.onUploadClick} />}
        />
        <DropImage onDragEnter={onDragEnter} onDragLeave={onDragLeave} />
        <WriteUploadMask visible={mask} />
      </Fragment>
    );
  }
}

export default connect(
  ({ write }: State) => ({
    body: write.body,
    mask: write.upload.mask,
  }),
  () => ({}),
)(CodeEditorContainer);
