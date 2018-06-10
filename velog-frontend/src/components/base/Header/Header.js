// @flow
import React, { type Node } from 'react';
import Responsive from 'components/common/Responsive';
import { Link } from 'react-router-dom';

import './Header.scss';

type Props = {
  right: Node,
  userMenu: Node,
};

const Header = ({ right, userMenu }: Props) => (
  <header className="base header">
    <Responsive className="header-wrapper">
      <Link className="brand" to="/">
        velog
      </Link>
      <div className="right">
        {right}
        {userMenu}
      </div>
    </Responsive>
  </header>
);

export default Header;
