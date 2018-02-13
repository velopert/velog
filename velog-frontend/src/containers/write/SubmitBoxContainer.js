// @flow

import React, { Component } from 'react';
import SubmitBox from 'components/write/SubmitBox';
import SelectCategory from 'components/write/SelectCategory';
import InputTags from 'components/write/InputTags';
import { connect } from 'react-redux';
import type { State } from 'store';
import { WriteActions } from 'store/actionCreators';

type Props = {
  open: boolean,
}

class SubmitBoxContainer extends Component<Props> {
  onClose = () => {
    WriteActions.closeSubmitBox();
  }
  render() {
    const { onClose } = this;
    const { open } = this.props;
    return (
      <SubmitBox
        selectCategory={<SelectCategory />}
        inputTags={<InputTags tags={['나의숲으로', '가자']} />}
        visible={open}
        onClose={onClose}
      />
    );
  }
}

export default connect(
  ({ write }: State) => ({
    open: write.submitBox.open,
  }),
  () => ({}),
)(SubmitBoxContainer);