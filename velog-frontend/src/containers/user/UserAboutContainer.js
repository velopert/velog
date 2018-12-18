// @flow
import React, { Component, Fragment } from 'react';
import { ProfileActions, BaseActions } from 'store/actionCreators';
import { type State } from 'store';
import { connect } from 'react-redux';
import UserAbout from 'components/user/UserAbout';
import UserAboutEdit from 'components/user/UserAboutEdit';
import { Helmet } from 'react-helmet';

type Props = {
  about: ?string,
  self: boolean,
  username: ?string,
  displayName: ?string,
};

type OwnProps = {
  username: ?string,
};

type UserAboutContainerState = {
  editing: boolean,
  text: string,
};

class UserAboutContainer extends Component<Props, UserAboutContainerState> {
  state = {
    editing: false,
    text: '',
  };

  onEditClick = () => {
    this.setState({
      editing: true,
    });
  };

  onSave = async () => {
    const { text } = this.state;
    try {
      await ProfileActions.updateAbout(text);
      BaseActions.showToast({
        message: '자기소개가 업데이트되었습니다.',
        type: 'success',
      });
    } catch (e) {
      BaseActions.showToast({
        message: '자기소개 업데이트 실패',
        type: 'error',
      });
    }
    this.setState({
      editing: false,
    });
  };

  onChange = (text: string) => {
    this.setState({
      text,
    });
  };

  componentDidMount() {
    ProfileActions.setSideVisibility(false);
  }

  componentWillUnmount() {
    ProfileActions.setSideVisibility(true);
  }

  render() {
    const { username, displayName } = this.props;
    if ((!this.props.about && this.props.about !== '') || !username || !displayName) return null;
    if (this.state.editing) {
      return <UserAboutEdit text={this.state.text} onChange={this.onChange} onSave={this.onSave} />;
    }
    return (
      <Fragment>
        {
          <Helmet>
            <title>{`About ${username} (${displayName}) | velog`}</title>
            <meta
              name="description"
              content={
                this.props.about === ''
                  ? `${displayName}님의 자기소개가 비어있습니다.`
                  : this.props.about
              }
            />
          </Helmet>
        }
        <UserAbout about={this.props.about} self={this.props.self} onEditClick={this.onEditClick} />
      </Fragment>
    );
  }
}

export default connect(({ profile, user }: State, ownProps: OwnProps) => ({
  username: profile.profile && profile.profile.username,
  displayName: profile.profile && profile.profile.display_name,
  about: profile.profile && profile.profile.about,
  self: (user.user && user.user.username) === ownProps.username,
}))(UserAboutContainer);
