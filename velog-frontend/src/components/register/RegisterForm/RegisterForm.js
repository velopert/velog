// @flow
import React from 'react';
import LabelInput from 'components/register/LabelInput';
import ArrowIcon from 'react-icons/lib/md/arrow-forward';

import './RegisterForm.scss';

type Props = {
  onChange(e: SyntheticInputEvent<HTMLInputElement>): void,
  onRegister(): Promise<*>,
  displayName: string,
  email: string,
  username: string,
  shortBio: string,
  emailEditable: boolean
};

const RegisterForm = ({
  onChange, onRegister,
  displayName, email, username, shortBio, emailEditable,
}: Props) => {
  return (
    <div className="register-form">
      <div className="form-head">
        <h2>기본 회원정보 등록</h2>
      </div>
      <div className="form-contents">
        <LabelInput value={displayName} name="displayName" required label="이름" placeholder="이름을 입력하세요" onChange={onChange} />
        <LabelInput type="email" value={email} name="email" required label="이메일" placeholder="이메일을 입력하세요" onChange={onChange} disabled={!emailEditable} />
        <LabelInput value={username} name="username" required label="아이디" placeholder="아이디를 입력하세요" onChange={onChange} />
        <LabelInput value={shortBio} name="shortBio" label="한줄소개" placeholder="한줄 소개를 입력하세요" onChange={onChange} />
        <div className="agreement">
          다음 버튼을 누르면 <span>서비스 이용약관</span>과 <span>개인정보취급방침</span>에 동의하는 것을 인정합니다.
        </div>
        <div className="button-wrapper">
          <div className="icon-button" onClick={onRegister}>
            <span>다음</span>
            <ArrowIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
