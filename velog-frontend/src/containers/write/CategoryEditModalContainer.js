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
  onSave = async () => {
    WriteActions.closeCategoryModal();
    const { categories } = this.props;
    if (!categories) return;
    const shouldRemove = categories.filter(c => c.hide);
    const shouldCreate = categories.filter(c => c.temp && !c.hide);
    const shouldUpdate = categories.filter(c => c.edited && !c.temp && !c.hide);

    try {
      const create = shouldCreate.map(c => WriteActions.createCategory(c.name));
      const remove = shouldRemove.map(c => WriteActions.deleteCategory(c.id));
      await Promise.all(create);
      await Promise.all(remove);
      WriteActions.listCategories();
    } catch (e) {
      console.log(e);
    }
  }
  render() {
    const { open, categories } = this.props;
    const { onClose, onCreate, onToggleEditCategory, onChange, onHideCategory, onSave } = this;

    return (
      <CategoryEditModal open={open} onClose={onClose} onSave={onSave}>
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