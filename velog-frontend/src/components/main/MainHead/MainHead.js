// @flow
import React from 'react';
import Button from 'components/common/Button';

import './MainHead.scss';

type Props = {
  onLogin(): void,
};

const MainHead = ({ onLogin }: Props) => (
  <div className="MainHead">
    <div className="button-area">{/* <Button>새 포스트 작성</Button> */}</div>
    <div className="spacer" />
    <div className="user-area">
      <Button theme="outline" onClick={onLogin}>
        로그인
      </Button>
    </div>
  </div>
);

export default MainHead;
