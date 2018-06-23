// @flow
import React from 'react';
import defaultThumbnail from 'static/images/default_thumbnail.png';
import Button from 'components/common/Button';
import './UserHead.scss';

type Props = {};

const UserHead = (props: Props) => (
  <div className="UserHead">
    <img src={defaultThumbnail} alt="thumbnail" />
    <div className="user-info">
      <section className="top">
        <div className="subscribe-wrapper">
          <Button className="subscribe">구독하기</Button>
        </div>
        <div className="username">@velopert</div>
      </section>
      <section className="mini-profile">
        <h2>김 민준</h2>
        <p>라프텔 프론트엔드 엔지니어</p>
      </section>
    </div>
  </div>
);

export default UserHead;
