// @flow
import React from 'react';
import RemoveIcon from 'react-icons/lib/io/trash-b';
import EditIcon from 'react-icons/lib/md/edit';
import CreateIcon from 'react-icons/lib/md/add-circle';
import './CategoryEditItemList.scss';
import CategoryEditItem from '../CategoryEditItem';

type Props = { }

const CategoryEditItemList = (props: Props) => (
  <div className="CategoryEditItemList">
    <CategoryEditItem edit />
    <CategoryEditItem />
    <CategoryEditItem />
    <CategoryEditItem />
    <CategoryEditItem />
    <CategoryEditItem />
    <CategoryEditItem />
    <CategoryEditItem />
    <CategoryEditItem />
    <div className="create-category util flex-center">
      <CreateIcon />
      <div>새 카테고리 만들기</div>
    </div>
  </div>
);

export default CategoryEditItemList;