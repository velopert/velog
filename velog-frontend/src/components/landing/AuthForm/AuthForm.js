// @flow
import React from 'react';
import SocialLoginButton from 'components/landing/SocialLoginButton';
import CheckIcon from 'react-icons/lib/md/check';
import Spinner from 'components/common/Spinner';
import cx from 'classnames';

import './AuthForm.scss';

type Props = {
  onChange(e: Event): void,
  onSendVerification(): Promise<*>,
  onEnterKeyPress(e: KeyboardEvent): void,
  onSocialLogin(provider: string): Promise<*>,
  email: string,
  sentEmail: boolean,
  sending: boolean,
  isUser: boolean,
};

const AuthForm = ({
  onChange,
  onSendVerification,
  onEnterKeyPress,
  email,
  sentEmail,
  sending,
  isUser,
  onSocialLogin,
}: Props) => {
  return (
    <div className="auth-form">
      {
        sentEmail
          ? (
            <div className="sent-email">
              <CheckIcon />
              <div className="text">
                {isUser ? '로그인' : '회원가입'} 링크가 이메일로 전송되었습니다.<br />
                이메일의 링크를 통하여 {isUser ? '로그인' : '회원가입'}을 계속하세요.
              </div>
            </div>
          ) : (
            <div className={cx('input-with-button', { sending })}>
              <input
                placeholder="이메일을 입력해주세요"
                value={email}
                onChange={onChange}
                disabled={sending}
                onKeyPress={onEnterKeyPress}
              />
              <div className="button" onClick={onSendVerification}>
                {sending ? <Spinner size="3rem" /> : '시작하기'}
              </div>
            </div>
        )
      }
      <div className="separator">
        <div className="or">OR</div>
      </div>
      <div className="social-buttons">
        <SocialLoginButton type="github" onSocialLogin={onSocialLogin} />
        <SocialLoginButton type="google" onSocialLogin={onSocialLogin} />
        <SocialLoginButton type="facebook" onSocialLogin={onSocialLogin} />
      </div>
    </div>
  );
};

export default AuthForm;
