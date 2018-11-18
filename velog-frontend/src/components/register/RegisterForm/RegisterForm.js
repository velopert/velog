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
  emailEditable: boolean,
  error: ?{
    name: string,
    payload: any,
  },
  hideEmail: boolean,
};

const errorMap = {
  DUPLICATED_ACCOUNT: (payload: string) =>
    `이미 존재하는 ${payload === 'email' ? '이메일' : '아이디'}입니다.`,
  FIELD_RULE: (payload: string) => {
    const rules = {
      displayName: '이름을 1~40자로 입력하세요.',
      username: '아이디는 3~16자의 영소문자, 숫자, - _ 가 허용됩니다.',
      shortBio: '한 줄 소개를 140자 미만으로 작성하세요.',
    };
    return rules[payload] || '입력한 데이터가 문제가 있습니다.';
  },
};

const printError = (error: { name: string, payload: any }) => {
  if (!errorMap[error.name]) return '알 수 없는 에러 발생!';
  return errorMap[error.name](error.payload);
};

const RegisterForm = ({
  onChange,
  onRegister,
  displayName,
  email,
  username,
  shortBio,
  emailEditable,
  error,
  hideEmail,
}: Props) => {
  return (
    <div className="register-form">
      <div className="form-head">
        <h2>기본 회원정보 등록</h2>
      </div>
      <div className="form-contents">
        <LabelInput
          value={displayName}
          name="displayName"
          required
          label="이름"
          placeholder="이름을 입력하세요"
          onChange={onChange}
        />
        <LabelInput
          type="email"
          value={email}
          name="email"
          required
          label="이메일"
          placeholder="이메일을 입력하세요"
          onChange={onChange}
          disabled={!emailEditable}
        />

        <LabelInput
          value={username}
          name="username"
          required
          label="아이디"
          placeholder="아이디를 입력하세요"
          onChange={onChange}
        />
        <LabelInput
          value={shortBio}
          name="shortBio"
          label="한줄소개"
          placeholder="한줄 소개를 입력하세요"
          onChange={onChange}
        />
        <div className="agreement">
          다음 버튼을 누르면{' '}
          <span>
            <a href="https://velog.io/policy/terms" target="_blank" rel="noopener noreferrer">
              서비스 이용약관
            </a>
          </span>과{' '}
          <span>
            <a href="https://velog.io/policy" target="_blank" rel="noopener noreferrer">
              개인정보취급방침
            </a>
          </span>에 동의하는 것을 인정합니다.
        </div>
        {error && <div className="error">{printError(error)}</div>}
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
