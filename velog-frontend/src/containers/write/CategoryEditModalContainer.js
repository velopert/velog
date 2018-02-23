// @flow
import React, { Component } from 'react';
import CategoryEditModal from 'components/write/CategoryEditModal';
import CategoryEditItemList from 'components/write/CategoryEditItemList';

type Props = {
};

class CategoryEditModalContainer extends Component<Props> {
  render() {
    return (
      <CategoryEditModal>
        <CategoryEditItemList />
      </CategoryEditModal>
    );
  }
}

export default CategoryEditModalContainer;