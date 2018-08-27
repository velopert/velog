// @flow
import React, { type ComponentType } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import './MainMobileHeadItem.scss';

type Props = {
  name: string,
  to: string,
  active: boolean,
};

const MainMobileHeadItem = ({ to, name, active }: Props) => {
  return (
    <Link to={to} className={cx('MainMobileHeadItem', { active })}>
      <div className="item-name">{name}</div>
    </Link>
  );
};

export default MainMobileHeadItem;
