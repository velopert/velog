// @flow
import React, { type Node } from 'react';
import Button from 'components/common/Button';
import type { UserData } from 'store/modules/user';
import MainHeadUserButton from 'components/main/MainHeadUserButton';

import './MainHead.scss';

type Props = {
  onLogin(): void,
  rightArea: ?Node,
  logged: boolean,
};

const MainHead = ({ logged, onLogin, rightArea }: Props) => (
  <div className="MainHead">
    <div className="button-area">{logged && <Button>새 포스트 작성</Button>}</div>
    <div className="spacer" />
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
