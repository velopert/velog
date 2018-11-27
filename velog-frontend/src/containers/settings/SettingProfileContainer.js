// @flow
import React, { Component } from 'react';
import type { State } from 'store';
import { connect } from 'react-redux';
import SettingProfile from 'components/settings/SettingProfile/SettingProfile';
import { type UserData } from 'store/modules/user';
import { SettingsActions, UserActions } from 'store/actionCreators';
import { type Profile } from 'store/modules/profile';
import { type UploadInfo } from 'store/modules/settings';
import axios from 'axios';
import storage, { keys } from 'lib/storage';
import { escapeForUrl } from 'lib/common';

type Props = {
  user: ?UserData,
  profile: ?Profile,
  uploadInfo: ?UploadInfo,
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
    if (!prevProps.user && this.props.user) {
      this.initialize();
    }
  }

  uploadFile = async (file: any) => {
    if (file.size > 1024 * 1024 * 10) return;
    const fileTypeRegex = /^image\/(.*?)/;
    if (!fileTypeRegex.test(file.type)) return;
    if (file.type.indexOf('gif') > 0) return;
    try {
      const filename = escapeForUrl(file.name);
      await SettingsActions.createThumbnailSignedUrl(filename);
      if (!this.props.uploadInfo) return;
      const { url, image_path: imagePath } = this.props.uploadInfo;
      await axios.put(url, file, {
        headers: {
          'Content-Type': file.type,
        },
        withCredentials: false,
        onUploadProgress: (e) => {
          if (window.nanobar) {
            window.nanobar.go(e.loaded / e.total * 100);
          }
        },
      });
      const imageUrl = `https://images.velog.io/${imagePath}`;
      await SettingsActions.updateProfile({
        thumbnail: imageUrl,
      });
      await UserActions.checkUser();
      storage.set(keys.user, this.props.user);
    } catch (e) {
      console.log(e);
    }
  };
  onUploadThumbnail = () => {
    const upload = document.createElement('input');
    upload.type = 'file';
    upload.onchange = (e) => {
      if (!upload.files) return;
      const file = upload.files[0];
      this.uploadFile(file);
    };
    upload.click();
  };

  onUpdateProfile = ({ displayName, shortBio }: { displayName: string, shortBio: string }) => {
    return SettingsActions.updateProfile({ displayName, shortBio });
  };

  render() {
    const { profile } = this.props;
    if (!profile) return null;
    return (
      <SettingProfile
        profile={profile}
        onUpdateProfile={this.onUpdateProfile}
        onUploadThumbnail={this.onUploadThumbnail}
      />
    );
  }
}

export default connect(
  ({ user, settings }: State) => ({
    user: user.user,
    profile: settings.profile,
    uploadInfo: settings.uploadInfo,
  }),
  () => ({}),
)(SettingProfileContainer);
