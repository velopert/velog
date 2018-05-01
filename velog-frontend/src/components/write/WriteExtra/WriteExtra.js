// @flow
import React, { Component } from 'react';
import CloseIcon from 'react-icons/lib/io/close';
import './WriteExtra.scss';
import WriteSelectLayouts from '../WriteSelectLayouts';

type Props = {};

class WriteExtra extends Component<Props> {
  render() {
    return (
      <div className="WriteExtra">
        <div className="close-button">
          <CloseIcon />
        </div>
        <section>
          <h4>레이아웃 설정</h4>
          <WriteSelectLayouts />
        </section>
      </div>
    );
  }
}

export default WriteExtra;
