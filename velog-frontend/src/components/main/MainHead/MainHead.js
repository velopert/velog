// @flow
import React, { Fragment, type Node } from 'react';
import Button from 'components/common/Button';
import type { UserData } from 'store/modules/user';
import MainHeadUserButton from 'components/main/MainHeadUserButton';
import { Link } from 'react-router-dom';
import CreateIcon from 'react-icons/lib/fa/plus-square';

import './MainHead.scss';

type Props = {
  onLogin(): void,
  rightArea: ?Node,
  logged: boolean,
};

const MainHead = ({ logged, onLogin, rightArea }: Props) => (
  <div className="MainHead">
    <div className="button-area">
      {logged && (
        <Button to="/write">
          <span className="desktop">새 포스트 작성</span>
          <span className="mobile">글쓰기</span>
        </Button>
      )}
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
