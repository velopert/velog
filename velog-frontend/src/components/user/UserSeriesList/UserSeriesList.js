// @flow
import React from 'react';
import { type SeriesItemData } from 'store/modules/profile';
import './UserSeriesList.scss';
import UserSeriesListItem from '../UserSeriesListItem';

type Props = {
  seriesList: SeriesItemData[],
};
const UserSeriesList = ({ seriesList }: Props) => {
  return (
    <div className="UserSeriesList">
      {seriesList.map(s => <UserSeriesListItem series={s} key={s.id} />)}
    </div>
  );
};

export default UserSeriesList;
