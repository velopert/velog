// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import './UserMenuItem.scss';

type Props = {
  to?: ?string,
  children: any
};

const UserMenuItem = ({ to, children, ...rest }: Props) => {
  if (!to) {
    return (
      <div className="user-menu-item" {...rest}>
        {children}
      </div>
    );
  }

  return (
    <Link className="user-menu-item" to={to} {...rest}>
      {children}
    </Link>
  );
};

UserMenuItem.defaultProps = {
  to: null,
};

export default UserMenuItem;