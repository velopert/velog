// @flow
import React, { Component } from 'react';
import type { ProfileLinks } from 'store/modules/settings';
import { connect } from 'react-redux';
import type { State } from 'store';
import SettingProfileLinks from 'components/settings/SettingProfileLinks';

type Props = {
  profileLinks: ?ProfileLinks,
};
class SettingProfileLinksContainer extends Component<Props> {
  render() {
    const { profileLinks } = this.props;
    return <SettingProfileLinks profileLinks={profileLinks} />;
  }
}

export default connect(({ settings }: State) => ({
  profileLinks: settings.profile && settings.profile.profile_links,
}))(SettingProfileLinksContainer);
