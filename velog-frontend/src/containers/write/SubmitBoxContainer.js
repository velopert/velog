// @flow

import React, { Component } from 'react';
import SubmitBox from 'components/write/SubmitBox';
import SelectCategory from 'components/write/SelectCategory';
import InputTags from 'components/write/InputTags';
import { connect } from 'react-redux';
import type { State } from 'store';
import { WriteActions, UserActions } from 'store/actionCreators';
import type { Categories } from 'store/modules/write';

type Props = {
  open: boolean,
  categories: ?Categories,
}

class SubmitBoxContainer extends Component<Props> {
  initialize = async () => {
    try {
      await WriteActions.listCategories();
    } catch (e) {
      console.log(e);
    }
  }
  componentDidMount() {
    this.initialize();
  }
  onClose = () => {
    WriteActions.closeSubmitBox();
  }
  onToggleCategory = (id) => {
    WriteActions.toggleCategory(id);
  }
  render() {
    const { onClose, onToggleCategory } = this;
    const { open, categories } = this.props;
    return (
      <SubmitBox
        selectCategory={<SelectCategory categories={categories} onToggle={onToggleCategory} />}
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
    categories: write.categories,
  }),
  () => ({}),
)(SubmitBoxContainer);