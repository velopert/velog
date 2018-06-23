// @flow
import React from 'react';
import './UserSide.scss';

type Props = {};

const UserSide = (props: Props) => (
  <div className="UserSide">
    <section>
      <div className="section-title">카테고리</div>
      <ul>
        <li>개발일지</li>
        <li>튜토리얼</li>
        <li>생각</li>
      </ul>
    </section>
    <section>
      <div className="section-title">태그</div>
      <ul>
        <li>Golang</li>
        <li>GraphQL</li>
        <li>JavaScript</li>
        <li>Node.js</li>
        <li>React</li>
        <li>Serverless</li>
      </ul>
    </section>
  </div>
);

export default UserSide;
