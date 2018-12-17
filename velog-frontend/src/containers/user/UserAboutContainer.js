// @flow
import React, { Component } from 'react';
import { ProfileActions } from 'store/actionCreators';
import { type State } from 'store';
import { connect } from 'react-redux';
import UserAbout from 'components/user/UserAbout';
import MarkdownEditor from 'components/common/MarkdownEditor';

type Props = {
  about: ?string,
  self: boolean,
};

type OwnProps = {
  username: ?string,
};

type UserAboutContainerState = {
  editing: boolean,
};

class UserAboutContainer extends Component<Props, UserAboutContainerState> {
  state = {
    editing: false,
  };

  onEditClick = () => {
    this.setState({
      editing: true,
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
      return (
        <MarkdownEditor
          placeholder="자기소개를 작성해보세요.
* markdown을 사용 하실 수 있습니다."
        />
      );
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
