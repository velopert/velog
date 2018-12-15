// @flow
import React, { Component } from 'react';
import type { ProfileLinks } from 'store/modules/settings';
import { connect } from 'react-redux';
import type { State } from 'store';
import { SettingsActions, BaseActions } from 'store/actionCreators';
import SettingProfileLinks from 'components/settings/SettingProfileLinks';

type Props = {
  profileLinks: ?ProfileLinks,
};
class SettingProfileLinksContainer extends Component<Props> {
  onUpdate = async (profileLinks: ProfileLinks) => {
    try {
      await SettingsActions.updateProfileLinks(profileLinks);
      BaseActions.showToast({
        type: 'success',
        message: '소셜 정보 업데이트 완료',
      });
    } catch (e) {
      BaseActions.showToast({
        type: 'error',
        message: '잘못된 정보입니다.',
      });
    }
  };
  render() {
    const { profileLinks } = this.props;
    if (!profileLinks) return null;
    return <SettingProfileLinks profileLinks={profileLinks} onUpdate={this.onUpdate} />;
  }
}

export default connect(({ settings }: State) => ({
  profileLinks: settings.profile && settings.profile.profile_links,
}))(SettingProfileLinksContainer);
