// @flow
import React from 'react';
import RemoveIcon from 'react-icons/lib/io/trash-b';
import EditIcon from 'react-icons/lib/md/edit';
import CreateIcon from 'react-icons/lib/md/add-circle';
import './CategoryEditItemList.scss';

type CategoryProps = {};

const Category = (props: CategoryProps) => {
  return (
    <div className="category">
      <div className="text">카테고리</div>
      <div className="buttons">
        <div className="button edit"><EditIcon /></div>
        <div className="button remove"><RemoveIcon /></div>
      </div>
    </div>
  );
};

type Props = { }

const CategoryEditItemList = (props: Props) => (
  <div className="CategoryEditItemList">
    <Category />
    <Category />
    <Category />
    <Category />
    <Category />
    <Category />
    <Category />
    <Category />
    <div className="create-category util flex-center">
      <CreateIcon />
      <div>새 카테고리 만들기</div>
    </div>
  </div>
);

export default CategoryEditItemList;