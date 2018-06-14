// @flow
import React from 'react';
import cx from 'classnames';
import CheckIcon from 'react-icons/lib/md/check';
import type { Categories } from 'store/modules/write';
import './SelectCategory.scss';

type CategoryProps = {
  id: string,
  name: string,
  active?: boolean,
  onToggle(id: string): void,
};

const Category = ({ id, name, active, onToggle }: CategoryProps) => (
  <div className={cx('category', { active })} onClick={() => onToggle(id)}>
    <div className="text">{name}</div>
    <CheckIcon />
  </div>
);

Category.defaultProps = {
  active: false,
};

type Props = {
  categories: ?Categories,
  onToggle(id: string): void,
};

const SelectCategory = ({ categories, onToggle }: Props) => {
  if (!categories || categories.length === 0) {
    // Category is Empty
    // TODO: Show something when empty.
    return null;
  }

  const categoryList = categories.map(category => (
    <Category
      onToggle={onToggle}
      key={category.id}
      name={category.name}
      id={category.id}
      active={category.active}
    />
  ));
  return <div className="SelectCategory">{categoryList}</div>;
};

export default SelectCategory;
