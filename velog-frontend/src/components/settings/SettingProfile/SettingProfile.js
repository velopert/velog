// @flow
import React, { Component } from 'react';
import Button from 'components/common/Button';

import './SettingProfile.scss';

type Props = {};

class SettingProfile extends Component<Props> {
  render() {
    return (
      <div className="SettingProfile">
        <div className="thumbnail-area">
          <img src="https://avatars0.githubusercontent.com/u/17202261?s=460&v=4" alt="thumbnail" />
          <Button large fullWidth>
            썸네일 변경
          </Button>
        </div>
        <form />
      </div>
    );
  }
}

export default SettingProfile;
