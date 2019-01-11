// @flow
import React from 'react';
import './UserSeriesList.scss';
import UserSeriesListItem from '../UserSeriesListItem';

type Props = {};
const UserSeriesList = (props: Props) => {
  return (
    <div>
      <UserSeriesListItem />
      <UserSeriesListItem />
      <UserSeriesListItem />
      <UserSeriesListItem />
      <UserSeriesListItem />
      <UserSeriesListItem />
    </div>
  );
};

export default UserSeriesList;
