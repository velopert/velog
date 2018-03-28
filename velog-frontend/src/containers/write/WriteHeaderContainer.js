// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { State } from 'store';
import { WriteActions } from 'store/actionCreators';
import WriteHeader from 'components/write/WriteHeader/WriteHeader';
import type { PostData } from 'store/modules/write';

type Props = {
  title: string,
  postData: ?PostData,
};


class WriteHeaderContainer extends Component<Props> {
  onChangeTitle = (e) => {
    const { value } = e.target;
    WriteActions.editField({
      field: 'title',
      value,
    });
  }

  onOpenSubmitBox = () => {
    WriteActions.openSubmitBox();
  }

  onCloseSubmitBox = () => {
    WriteActions.closeSubmitBox();
  }

  render() {
    const { onChangeTitle, onOpenSubmitBox } = this;
    const { title, postData } = this.props;
    return (
      <WriteHeader
        onOpenSubmitBox={onOpenSubmitBox}
        onChangeTitle={onChangeTitle}
        title={title}
        isEdit={!!postData}
      />
    );
  }
}

export default connect(
  ({ write }: State) => ({
    title: write.title,
    postData: write.postData,
  }),
  () => ({}),
)(WriteHeaderContainer);
