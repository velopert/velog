// @flow
import React from 'react';
import Responsive from 'components/common/Responsive';
import './Header.scss';


const Header = () => (
  <header className="base header">
    <Responsive className="header-wrapper">
      <div className="brand">
        velog
      </div>
      <nav>
        <a className="active" href="/">트렌딩</a>
        <a href="/">최신 글</a>
        <a href="/">태그</a>
      </nav>
      <div className="right">
        right side
      </div>
    </Responsive>
  </header>
);

export default Header;
