// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import './ErrorInfo.scss';

type Props = {
  message: string,
  code: string,
};

const ErrorInfo = ({ code, message }: Props) => {
  return (
    <div className="ErrorInfo">
      <div className="code">{code}</div>
      <div className="message">{message}</div>
      <Link className="gohome" to="/">
        홈으로
      </Link>
    </div>
  );
};

export default ErrorInfo;
