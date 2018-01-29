// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { State } from 'store';
import { WriteActions } from 'store/actionCreators';
import WriteHeader from 'components/write/WriteHeader/WriteHeader';

type Props = {};

class WriteHeaderContainer extends Component<Props> {
  onChangeTitle = (e) => {
    const { value } = e.target;
    WriteActions.editField({
      field: 'title',
      value,
    });
  }

  render() {
    const { onChangeTitle } = this;
    const { title } = this.props;
    return (
      <WriteHeader
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
