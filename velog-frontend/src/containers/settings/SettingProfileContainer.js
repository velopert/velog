// @flow
import React, { Component } from 'react';
import type { State } from 'store';
import { connect } from 'react-redux';
import SettingProfile from 'components/settings/SettingProfile/SettingProfile';
import { type UserData } from 'store/modules/user';
import { SettingsActions } from 'store/actionCreators';
import { type Profile } from 'store/modules/profile';

type Props = {
  user: ?UserData,
  profile: ?Profile,
};

class SettingProfileContainer extends Component<Props> {
  initialize = () => {
    const { user } = this.props;
    if (!user) return;
    SettingsActions.getProfile(user.username);
  };

  componentDidMount() {
    this.initialize();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user !== this.props.user) {
      this.initialize();
    }
  }

  onUpdateProfile = ({ displayName, shortBio }: { displayName: string, shortBio: string }) => {
    return SettingsActions.updateProfile({ displayName, shortBio });
  };

  render() {
    const { profile } = this.props;
    if (!profile) return null;
    return <SettingProfile profile={profile} onUpdateProfile={this.onUpdateProfile} />;
  }
}

export default connect(
  ({ user, settings }: State) => ({
    user: user.user,
    profile: settings.profile,
  }),
  () => ({}),
)(SettingProfileContainer);
