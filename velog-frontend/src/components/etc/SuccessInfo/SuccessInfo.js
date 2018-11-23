// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import CheckIcon from 'react-icons/lib/md/check';
import './SuccessInfo.scss';

type Props = {
  message?: string,
  type?: ?string,
};

const messages = {
  unsubscribe_email: '이메일 수신거부가 정상적으로 처리되었습니다.',
};

const SuccessInfo = (props: Props) => {
  const message = props.type ? messages[props.type] : props.message;
  return (
    <div className="SuccessInfo">
      <div className="center-box">
        <div className="check">
          <CheckIcon />
        </div>
        <div className="description">{message}</div>
        <Link to="/">홈으로 이동</Link>
      </div>
    </div>
  );
};

SuccessInfo.defaultProps = {
  message: '요청이 성공적으로 이뤄졌습니다.',
  type: null,
};

export default SuccessInfo;
