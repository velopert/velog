// @flow
import React, { Component } from 'react';
import MainTemplate from 'components/main/MainTemplate';
import MainTab from 'components/main/MainTab';

type Props = {};

class MainContainer extends Component<Props> {
  render() {
    return (
      <MainTemplate
        tab={(
          <MainTab />
        )}
      >
        작은 물고기가뭐지
      </MainTemplate>
    );
  }
}

export default MainContainer;