// @flow
import React, { Component } from 'react';
import MarkdownPreview from 'components/write/MarkdownPreview';
import { connect } from 'react-redux';
import type { State } from 'store';
import type { Meta, PostData } from 'store/modules/write';

type Props = {
  title: string,
  body: string,
  meta: Meta,
  postData: ?PostData,
};

class MarkdownPreviewContainer extends Component<Props> {
  render() {
    const { title, body, meta, postData } = this.props;
    return (
      <MarkdownPreview
        title={title}
        body={body}
        theme={meta.code_theme || (postData && postData.meta.code_theme)}
      />
    );
  }
}

export default connect(
  ({ write }: State) => ({
    title: write.title,
    body: write.body,
    meta: write.meta,
    postData: write.postData,
  }),
  () => ({}),
)(MarkdownPreviewContainer);
