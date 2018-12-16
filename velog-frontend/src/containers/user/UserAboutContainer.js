// @flow
import React, { Component } from 'react';
import { ProfileActions } from 'store/actionCreators';
import { type State } from 'store';
import { connect } from 'react-redux';
import UserAbout from '../../components/user/UserAbout';

type Props = {
  about: ?string,
  self: boolean,
};

type OwnProps = {
  username: ?string,
};

class UserAboutContainer extends Component<Props> {
  componentDidMount() {
    ProfileActions.setSideVisibility(false);
  }

  componentWillUnmount() {
    ProfileActions.setSideVisibility(true);
  }

  render() {
    if (!this.props.about && this.props.about !== '') return null;
    return <UserAbout about={this.props.about} self={this.props.self} />;
  }
}

export default connect(({ profile, user }: State, ownProps: OwnProps) => ({
  about: profile.profile && profile.profile.about,
  self: (user.user && user.user.username) === ownProps.username,
}))(UserAboutContainer);
