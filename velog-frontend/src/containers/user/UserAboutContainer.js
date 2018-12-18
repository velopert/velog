// @flow
import React, { Component } from 'react';
import { ProfileActions, BaseActions } from 'store/actionCreators';
import { type State } from 'store';
import { connect } from 'react-redux';
import UserAbout from 'components/user/UserAbout';
import UserAboutEdit from 'components/user/UserAboutEdit';

type Props = {
  about: ?string,
  self: boolean,
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
    if (!this.props.about && this.props.about !== '') return null;
    if (this.state.editing) {
      return <UserAboutEdit text={this.state.text} onChange={this.onChange} onSave={this.onSave} />;
    }
    return (
      <UserAbout about={this.props.about} self={this.props.self} onEditClick={this.onEditClick} />
    );
  }
}

export default connect(({ profile, user }: State, ownProps: OwnProps) => ({
  about: profile.profile && profile.profile.about,
  self: (user.user && user.user.username) === ownProps.username,
}))(UserAboutContainer);
