// @flow
import React, { type Node } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import './MainMenuItem.scss';

type Props = {
  icon: Node,
  text: string,
  to: string,
  active?: boolean,
};

const MainMenuItem = ({ icon, text, to, active }: Props) => {
  return (
    <li className={cx('MainMenuItem', { active })}>
      <Link to={to}>
        {icon}
        <div className="text">{text}</div>
      </Link>
    </li>
  );
};

MainMenuItem.defaultProps = {
  to: '',
  active: false,
};

export default MainMenuItem;
