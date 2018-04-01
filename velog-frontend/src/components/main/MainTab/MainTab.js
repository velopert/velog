// @flow
import React from 'react';
import './MainTab.scss';

type Props = { }

const MainTab = (props: Props) => (
  <nav className="MainTab">
    <a className="active" href="/">트렌딩</a>
    <a href="/">최신 글</a>
    <a href="/">태그</a>
  </nav>
);

export default MainTab;