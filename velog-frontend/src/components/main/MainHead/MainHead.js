// @flow
import React, { Fragment, type Node } from 'react';
import Button from 'components/common/Button';
import type { UserData } from 'store/modules/user';
import { Link } from 'react-router-dom';
import SearchIcon from 'react-icons/lib/md/search';

import './MainHead.scss';

type Props = {
  onLogin(): void,
  rightArea: ?Node,
  logged: boolean,
};

const MainHead = ({ logged, onLogin, rightArea }: Props) => (
  <div className="MainHead">
    <div className="button-area">
      <Link to="/search" className="search-btn">
        <SearchIcon />
      </Link>
    </div>
    <div className="spacer" />
    <Link to="/" className="mobile-logo">
      velog
    </Link>
    <div className="right-area">
      {rightArea || (
        <Button theme="outline" onClick={onLogin}>
          로그인
        </Button>
      )}
    </div>
  </div>
);

export default MainHead;
