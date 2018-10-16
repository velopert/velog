// @flow
import React, { Component } from 'react';
import { FollowActions } from 'store/actionCreators';
import type { State } from 'store';
import { connect } from 'react-redux';
import UserHead from 'components/user/UserHead';
import { type Profile } from 'store/modules/profile';

type OwnProps = {
  username: ?string,
};
type Props = OwnProps & {
  profile: ?Profile,
  self: boolean,
  followingUsers: {
    [string]: boolean,
  },
  followLoading: boolean,
  shouldCancel: boolean,
  logged: boolean,
  rawTagName: ?string,
};

class UserHeadContainer extends Component<Props> {
  initialize = () => {
    const { profile, shouldCancel, logged } = this.props;
    if (!profile || !logged) return;
    if (shouldCancel) return;
    FollowActions.getUserFollow(profile.id);
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.profile !== this.props.profile) {
      this.initialize();
    }
  }

  componentDidMount() {
    this.initialize();
  }

  onToggleFollow = () => {
    const { profile, followingUsers, followLoading } = this.props;
    if (!profile || followLoading) return;

    const { id } = profile;
    const following = followingUsers[id];

    if (following) {
      FollowActions.unfollowUser(id);
      return;
    }
    FollowActions.followUser(id);
  };
  render() {
    const { profile, self, followingUsers, username, rawTagName } = this.props;

    if (!profile || !username) return <UserHead.Placeholder />;

    const following = followingUsers[profile.id];

    return (
      <UserHead
        username={username}
        profile={profile}
        self={self}
        following={following}
        onToggleFollow={this.onToggleFollow}
        rawTagName={rawTagName}
      />
    );
  }
}

export default connect(
  (state: State, ownProps: OwnProps) => ({
    profile: state.profile.profile,
    self: (state.user.user && state.user.user.username) === ownProps.username,
    followingUsers: state.follow.users,
    followLoading:
      state.pender.pending['follow/FOLLOW_USER'] || state.pender.pending['follower/UNFOLLOW_USER'],
    shouldCancel: state.common.ssr && !state.common.router.altered,
    logged: !!state.user.user,
    rawTagName: state.profile.rawTagName,
  }),
  () => ({}),
)(UserHeadContainer);
