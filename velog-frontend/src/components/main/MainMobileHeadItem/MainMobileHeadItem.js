// @flow
import React, { type ComponentType } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import './MainMobileHeadItem.scss';

type Props = {
  name: string,
  to: string,
  active: boolean,
  icon: ComponentType<any>,
};

const MainMobileHeadItem = ({ to, name, icon, active }: Props) => {
  const iconElement = React.createElement(icon);
  return (
    <Link to={to} className={cx('MainMobileHeadItem', { active })}>
      <div className="icon-wrapper">{iconElement}</div>
      <div className="item-name">{name}</div>
    </Link>
  );
};

export default MainMobileHeadItem;
