// @flow
import React, { Component } from 'react';
import CategoryEditModal from 'components/write/CategoryEditModal';
import CategoryEditItemList from 'components/write/CategoryEditItemList';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { State } from 'store';
import { WriteActions } from 'store/actionCreators';
import type { Categories } from 'store/modules/write';
import Sortable from 'sortablejs';

type Props = {
  open: boolean,
  categories: ?Categories,
  ordered: boolean,
};

class CategoryEditModalContainer extends Component<Props> {
  listElement:any = null;
  sortable:any = null;

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
    const { categories, ordered } = this.props;
    if (!categories) return;
    const shouldRemove = categories.filter(c => c.hide);
    const shouldCreate = categories.filter(c => c.temp && !c.hide);
    const shouldUpdate = categories.filter(c => c.edited && !c.temp && !c.hide);

    try {
      const create = shouldCreate.map(c => WriteActions.createCategory(c.name, c.id));
      const remove = shouldRemove.map(c => WriteActions.deleteCategory(c.id));
      const update = shouldUpdate.map(c => WriteActions.updateCategory({
        id: c.id,
        name: c.name,
      }));
      await Promise.all(create);
      await Promise.all(remove);
      await Promise.all(update);
      if (!this.props.categories) return;
      const categoryOrders = this.props.categories.map(
        (category, i) => ({ id: category.id, order: i }));
      await WriteActions.reorderCategories(categoryOrders);
    } catch (e) {
      console.log(e);
    }
  }

  initialize = () => {
    this.sortable = Sortable.create(this.listElement, {
      animation: 150,
      chosenClass: 'chosen',
      ghostClass: 'ghost', // Class name for the drop placeholder
      dragClass: 'drag', // Class name for the dragging item
      onUpdate: (e:any) => {
        const { oldIndex, newIndex } = e;
        WriteActions.reorderCategory({ from: oldIndex, to: newIndex });
      },
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.open && this.props.open) {
      this.initialize();
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
          innerRef={
            (ref) => {
              this.listElement = ref;
            }
          }
        />
      </CategoryEditModal>
    );
  }
}

export default connect(
  ({ write }: State) => ({
    open: write.categoryModal.open,
    categories: write.categoryModal.categories,
    ordered: write.categoryModal.ordered,
  }),
  () => ({}),
)(CategoryEditModalContainer);