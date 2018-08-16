// @flow
import React, { Component } from 'react';
import WriteMobileTitle from 'components/write/WriteMobileTitle';
import type { State } from 'store';
import { connect } from 'react-redux';
import { WriteActions } from 'store/actionCreators';

type Props = {
  title: string,
};

class WriteMobileTitleContainer extends Component<Props> {
  onChange = (e) => {
    WriteActions.editField({
      field: 'title',
      value: e.target.value,
    });
  };
  render() {
    const { title } = this.props;
    return <WriteMobileTitle onChange={this.onChange} title={title} />;
  }
}

export default connect(
  ({ write }: State) => ({
    title: write.title,
  }),
  () => ({}),
)(WriteMobileTitleContainer);
