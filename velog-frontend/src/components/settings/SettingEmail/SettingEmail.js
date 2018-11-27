// @flow

import React, { Component } from 'react';
import type { EmailInfoData } from 'store/modules/settings';
import WarningIcon from 'react-icons/lib/md/warning';
import cx from 'classnames';
import './SettingEmail.scss';

type Props = {
  emailInfo: EmailInfoData,
};

class SettingEmail extends Component<Props> {
  render() {
    const { emailInfo } = this.props;
    return (
      <div className="SettingEmail">
        <div className="current-email">
          <div className={cx('email', { empty: !emailInfo.email })}>
            {!emailInfo.email && <WarningIcon />}
            {emailInfo.email || '이메일이 존재하지 않습니다.'}
          </div>
        </div>
      </div>
    );
  }
}

export default SettingEmail;
