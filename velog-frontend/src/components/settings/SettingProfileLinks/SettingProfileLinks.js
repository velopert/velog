// @flow
import React, { Component } from 'react';
import type { ProfileLinks } from 'store/modules/settings';
import './SettingProfileLinks.scss';
import SettingProfileLink from '../SettingProfileLink';
import Button from '../../common/Button';

type Props = {
  profileLinks: ?ProfileLinks,
  onUpdate: (profileLinks: ProfileLinks) => Promise<any>,
};
type State = {
  email: string,
  twitter: string,
  github: string,
  facebook: string,
  url: string,
};

class SettingProfileLinks extends Component<Props, State> {
  state = {
    email: '',
    github: '',
    twitter: '',
    facebook: '',
    url: '',
  };

  feedInputs = () => {
    const { profileLinks } = this.props;
    if (!profileLinks) return;
    const keys = Object.keys(profileLinks);
    const nextState = {};
    keys.forEach((key) => {
      nextState[key] = profileLinks[key] || '';
    });
    this.setState(nextState);
  };

  componentDidMount() {
    this.feedInputs();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.profileLinks !== this.props.profileLinks) {
      this.feedInputs();
    }
  }

  onChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    this.setState({
      [name]: value,
    });
  };

  onUpdate = () => {
    const { email, twitter, github, facebook, url } = this.state;
    this.props.onUpdate({
      email,
      twitter,
      github,
      facebook,
      url,
    });
  };

  render() {
    const { email, twitter, github, facebook, url } = this.state;
    return (
      <section className="SettingProfileLinks">
        <h5>소셜 정보</h5>
        <p>여기에 입력하는 정보는 자신의 벨로그 프로필에서 나타나게 됩니다.</p>
        <div className="inputs">
          <SettingProfileLink label="이메일" name="email" value={email} onChange={this.onChange} />
          <SettingProfileLink
            label="GitHub"
            name="github"
            value={github}
            onChange={this.onChange}
            templateURL="https://github.com/"
          />
          <SettingProfileLink
            label="Twitter"
            name="twitter"
            value={twitter}
            onChange={this.onChange}
            templateURL="https://twitter.com/"
          />
          <SettingProfileLink
            label="Facebook"
            name="facebook"
            value={facebook}
            onChange={this.onChange}
            templateURL="https://facebook.com/"
          />
          <SettingProfileLink label="홈페이지" name="url" value={url} onChange={this.onChange} />
        </div>
        <div className="button-wrapper">
          <Button large onClick={this.onUpdate}>
            저장
          </Button>
        </div>
      </section>
    );
  }
}

export default SettingProfileLinks;
