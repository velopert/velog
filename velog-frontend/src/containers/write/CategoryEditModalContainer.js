// @flow
import React, { Component } from 'react';
import CategoryEditModal from 'components/write/CategoryEditModal';
import CategoryEditItemList from 'components/write/CategoryEditItemList';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { State } from 'store';
import { WriteActions } from 'store/actionCreators';
import type { Categories } from 'store/modules/write';

type Props = {
  open: boolean,
  categories: ?Categories,
};

class CategoryEditModalContainer extends Component<Props> {
  onClose = () => {
    WriteActions.closeCategoryModal();
  }
  onCreate = () => {
    WriteActions.createTempCategory();
  }
  onToggleEditCategory = (id) => {
    WriteActions.toggleEditCategory(id);
  }
  onChange = ({ id, name }: { id: string, name: string }) => {
    WriteActions.changeCategoryName({
      id,
      name,
    });
  }
  onHideCategory = (id: string) => {
    WriteActions.hideCategory(id);
  }
  render() {
    const { open, categories } = this.props;
    const { onClose, onCreate, onToggleEditCategory, onChange, onHideCategory } = this;

    return (
      <CategoryEditModal open={open} onClose={onClose}>
        <CategoryEditItemList
          categories={categories}
          onCreate={onCreate}
          onToggleEditCategory={onToggleEditCategory}
          onChange={onChange}
          onHideCategory={onHideCategory}
        />
      </CategoryEditModal>
    );
  }
}

export default connect(
  ({ write }: State) => ({
    open: write.categoryModal.open,
    categories: write.categoryModal.categories,
  }),
  () => ({}),
)(CategoryEditModalContainer);