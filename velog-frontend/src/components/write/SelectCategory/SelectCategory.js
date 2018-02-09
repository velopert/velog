// @flow
import React from 'react';
import cx from 'classnames';
import CheckIcon from 'react-icons/lib/md/check';

import './SelectCategory.scss';

type CategoryProps = {
  id: string,
  name: string,
  active?: boolean,
};

const Category = ({ id, name, active }: CategoryProps) => (
  <div className={cx('category', { active })}>
    <div className="text">{name}</div>
    <CheckIcon />
  </div>
);

Category.defaultProps = {
  active: false,
};

type Props = {
  categories: Array<*>
};

const SelectCategory = () => {
  return (
    <div className="SelectCategory">
      <Category name="hello" id="1" />
      <Category name="hello" id="1" />
      <Category name="hello" id="1" active />
      <Category name="hello" id="1" />
      <Category name="hello" id="1" />
      <Category name="hello" id="1" />
      <Category name="hello" id="1" />
      <Category name="hello" id="1" />
      <Category name="hello" id="1" />
      <Category name="hello" id="1" />
      <Category name="hello" id="1" />
    </div>
  );
};

export default SelectCategory;