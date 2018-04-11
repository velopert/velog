// @flow

import React, { Component, Fragment } from 'react';
import CodeEditor from 'components/write/CodeEditor/CodeEditor';
import FloatingImageButton from 'components/write/FloatingImageButton';
import { connect } from 'react-redux';
import type { State } from 'store';
import { WriteActions } from 'store/actionCreators';
import DropImage from 'components/write/DropImage';

type Props = {
  body: string,
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

  componentWillUnmount() {
    WriteActions.reset(); // reset Write Module on page leave
  }

  render() {
    const { onEditBody } = this;
    const { body } = this.props;

    return (
      <Fragment>
        <CodeEditor
          onEditBody={onEditBody}
          body={body}
          imageButton={<FloatingImageButton onClick={this.onUploadClick} />}
        />
        <DropImage />
      </Fragment>
    );
  }
}

export default connect(
  ({ write }: State) => ({
    body: write.body,
  }),
  () => ({}),
)(CodeEditorContainer);
