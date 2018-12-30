// @flow
import React, { Component } from 'react';
import './SubmitBoxSeries.scss';

type Props = {};
class SubmitBoxSeries extends Component<Props> {
  render() {
    return (
      <div className="SubmitBoxSeries">
        <h3>시리즈 설정</h3>
        <div className="list-wrapper">
          <form>
            <input placeholder="새로운 시리즈 이름을 입력하세요." />
          </form>
          <div className="list">
            <div className="item">하이 나는 아이템</div>
            <div className="item">하이 나는 아이템</div>
            <div className="item active">하이 나는 아이템</div>
            <div className="item">하이 나는 아이템</div>
            <div className="item">하이 나는 아이템</div>
            <div className="item">하이 나는 아이템</div>
          </div>
        </div>
      </div>
    );
  }
}

export default SubmitBoxSeries;
