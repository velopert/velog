// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import CheckIcon from 'react-icons/lib/md/check';
import './EmailCertify.scss';

const EmailCertify = () => {
  return (
    <div className="EmailCertify">
      <div className="center-box">
        <div className="check">
          <CheckIcon />
        </div>
        <div className="description">이메일 인증이 완료되었습니다</div>
        <Link to="/">홈으로 이동</Link>
      </div>
    </div>
  );
};

export default EmailCertify;
