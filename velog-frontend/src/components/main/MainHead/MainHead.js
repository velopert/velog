// @flow
import React, { type Node } from 'react';
import Button from 'components/common/Button';
import type { UserData } from 'store/modules/user';
import MainHeadUserButton from 'components/main/MainHeadUserButton';
import { Link } from 'react-router-dom';

import './MainHead.scss';

type Props = {
  onLogin(): void,
  rightArea: ?Node,
  logged: boolean,
};

const MainHead = ({ logged, onLogin, rightArea }: Props) => (
  <div className="MainHead">
    <div className="button-area">{logged && <Button to="/write">새 포스트 작성</Button>}</div>
    <div className="spacer" />
    <Link to="/" className="mobile-logo">
      velog
      <div className="badge">alpha</div>
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
