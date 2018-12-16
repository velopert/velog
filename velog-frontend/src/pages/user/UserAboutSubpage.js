// @flow
import React from 'react';
import { type ContextRouter } from 'react-router-dom';
import UserAboutContainer from '../../containers/user/UserAboutContainer';

type Props = {} & ContextRouter;
const UserAboutSubpage = (props: Props) => {
  return <UserAboutContainer username={props.match.params.username} />;
};

export default UserAboutSubpage;
