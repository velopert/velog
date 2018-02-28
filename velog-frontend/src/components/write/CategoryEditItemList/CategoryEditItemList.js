// @flow
import React from 'react';
import RemoveIcon from 'react-icons/lib/io/trash-b';
import EditIcon from 'react-icons/lib/md/edit';
import CreateIcon from 'react-icons/lib/md/add-circle';
import type { Categories } from 'store/modules/write';
import './CategoryEditItemList.scss';
import CategoryEditItem from '../CategoryEditItem';

type Props = {
  categories: ?Categories
}

const CategoryEditItemList = ({ categories }: Props) => {
  if (!categories) return null;
  const categoryList = categories.map(
    category => (
      <CategoryEditItem
        key={category.id}
        name={category.name}
      />
    ),
  );
  return (
    <div className="CategoryEditItemList">
      {categoryList}
      <div className="create-category util flex-center">
        <CreateIcon />
        <div>새 카테고리 만들기</div>
      </div>
    </div>
  );
};


export default CategoryEditItemList;