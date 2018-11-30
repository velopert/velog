// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { UserData } from 'store/modules/user';
import type { EmailInfoData } from 'store/modules/settings';
import type { State } from 'store';
import { SettingsActions, BaseActions } from 'store/actionCreators';

import SettingEmail from '../../components/settings/SettingEmail';

type Props = {
  user: ?UserData,
  emailInfo: ?EmailInfoData,
};

class SettingEmailContainer extends Component<Props> {
  lastRequestTime: ?number = null;
  initialize = async () => {
    const { user } = this.props;
    if (!user) return;
    try {
      await SettingsActions.getEmailInfo();
    } catch (e) {
      console.log(e);
    }
  };
  componentDidMount() {
    this.initialize();
  }
  componentDidUpdate(prevProps) {
    if (!prevProps.user && this.props.user) {
      this.initialize();
    }
  }

  onResendCertmail = async () => {
    const current = new Date().getTime();

    if (current - (this.lastRequestTime || 0) < 1000 * 15) {
      BaseActions.showToast({ type: 'error', message: '잠시 후 요청해주세요.' });
      return;
    }
    await SettingsActions.resendCertmail();
    BaseActions.showToast({ type: 'success', message: '인증 메일을 재발송했습니다.' });
    this.lastRequestTime = current;
  };

  onChangeEmail = async (email: string) => {
    await SettingsActions.changeEmail(email);
    await this.initialize();
    BaseActions.showToast({ type: 'success', message: '이메일이 변경되었습니다.' });
  };

  onUpdateEmailPermission = (payload: { name: string, value: boolean }) => {
    SettingsActions.updateEmailPermission(payload);
  };

  onSaveEmailPermissions = async () => {
    const { emailInfo } = this.props;
    if (!emailInfo) return;
    await SettingsActions.saveEmailPermissions(emailInfo.permissions);
    BaseActions.showToast({ type: 'success', message: '이메일 수신 설정이 저장되었습니다.' });
  };

  render() {
    if (!this.props.emailInfo) return null;
    return (
      <SettingEmail
        emailInfo={this.props.emailInfo}
        onChangeEmail={this.onChangeEmail}
        onResendCertmail={this.onResendCertmail}
        onUpdateEmailPermission={this.onUpdateEmailPermission}
        onSaveEmailPermissions={this.onSaveEmailPermissions}
      />
    );
  }
}

export default connect(
  ({ settings, user }: State) => ({
    user: user.user,
    emailInfo: settings.emailInfo,
  }),
  () => ({}),
)(SettingEmailContainer);
