// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { State } from 'store';
import { WriteActions } from 'store/actionCreators';
import WriteHeader from 'components/write/WriteHeader/WriteHeader';

type Props = {
  title: string,
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
    const { title } = this.props;
    return (
      <WriteHeader
        onOpenSubmitBox={onOpenSubmitBox}
        onChangeTitle={onChangeTitle}
        title={title}
      />
    );
  }
}

export default connect(
  ({ write }: State) => ({
    title: write.title,
  }),
  () => ({}),
)(WriteHeaderContainer);
