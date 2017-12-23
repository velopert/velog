// @flow
import React from 'react';
import SocialLoginButton from 'components/home/SocialLoginButton';

import './AuthForm.scss';

type Props = {
  onChange(e: Event): void,
  email: string,
};

const AuthForm = ({ onChange, email }: Props) => {
  return (
    <div className="auth-form">
      <div className="input-with-button">
        <input placeholder="이메일을 입력해주세요" value={email} onChange={onChange} />
        <div className="button">시작하기</div>
      </div>
      <div className="separator">
        <div className="or">OR</div>
      </div>
      <div className="social-buttons">
        <SocialLoginButton type="github" />
        <SocialLoginButton type="google" />
        <SocialLoginButton type="facebook" />
      </div>
    </div>
  );
};

export default AuthForm;
