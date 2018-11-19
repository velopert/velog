// @flow
import React from 'react';
import { type ContextRouter } from 'react-router-dom';

import UserPosts from 'containers/user/UserPosts';

type Props = ContextRouter & {};

const UserPostsSubpage = ({ match }: Props) => {
  // $FlowFixMe
  return <UserPosts username={match.params.username} tag={match.params.tag} />;
};

export default UserPostsSubpage;
