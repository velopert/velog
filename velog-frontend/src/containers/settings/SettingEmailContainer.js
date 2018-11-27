// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { UserData } from 'store/modules/user';
import type { EmailInfoData } from 'store/modules/settings';
import type { State } from 'store';
import { SettingsActions } from 'store/actionCreators';

import SettingEmail from '../../components/settings/SettingEmail';

type Props = {
  user: ?UserData,
  emailInfo: ?EmailInfoData,
};

class SettingEmailContainer extends Component<Props> {
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
  render() {
    if (!this.props.emailInfo) return null;
    return <SettingEmail emailInfo={this.props.emailInfo} />;
  }
}

export default connect(
  ({ settings, user }: State) => ({
    user: user.user,
    emailInfo: settings.emailInfo,
  }),
  () => ({}),
)(SettingEmailContainer);
