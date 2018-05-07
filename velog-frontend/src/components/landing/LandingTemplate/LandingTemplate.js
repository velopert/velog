import React from 'react';
import Responsive from 'components/common/Responsive';
import './LandingTemplate.scss';

const LandingTemplate = ({ form }) => {
  return (
    <div className="LandingTemplate">
      <div className="left">
        <div>
          <div className="logo">velog</div>
          <h2>개발자들은 대체 글을 어디서 써야 할까....?</h2>
          <p>마크다운, 코드 하이라이팅 등...
            <br />개발자들의 취향저격하는 글쓰기 플랫폼이 바로 여기에,
            <br />고민하지 말고 지금 시작하자.
          </p>
        </div>
      </div>
      <div className="right">
        <div className="wrapper">
          <h2>지금, 벨로그를 시작하세요.</h2>
          <div className="auth-form">
            {form}
          </div>
        </div>
      </div>
      {/* <Responsive className="block">
        <div className="left-text">
          <div>
            <h1 className="logo">velog</h1>
            <h2>
              개발자들은 대체<br />어디서 글을 써야 하나...
            </h2>
            <div className="description">
              <p>바아~ 로 벨로그에서!</p>
              <p>
                길 잃은 글 쓰고픈 개발자들을 취향저격할 글쓰기 플랫폼이 바로 요기에! <br />
                마크다운, 코드 하이라이팅 등... 그만 고민하고 지금 시작하자.
              </p>
            </div>
          </div>
        </div>
        <div className="right">
          <div className="right-form">
            <div className="black-box">
              <h2>로그인 또는 회원가입</h2>
              {form}
            </div>
            <div className="register-button">지금 시작하기</div>
          </div>
        </div>
      </Responsive> */}
    </div>
  );
};

export default LandingTemplate;
