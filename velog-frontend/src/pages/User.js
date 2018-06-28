// @flow
import React from 'react';
import ViewerHead from 'components/base/ViewerHead';
import RightCorner from 'containers/base/RightCorner';
import UserTemplate from 'components/user/UserTemplate';
import UserHeadContainer from 'containers/user/UserHeadContainer';
import UserContentContainer from 'containers/user/UserContentContainer';

import { type Match } from 'react-router-dom';

type Props = {
  match: Match,
};

const User = ({ match }: Props) => {
  return (
    <UserTemplate header={<ViewerHead rightCorner={<RightCorner />} />}>
      <UserHeadContainer username={match.params.username} />
      <UserContentContainer />
    </UserTemplate>
  );
};

export default User;
