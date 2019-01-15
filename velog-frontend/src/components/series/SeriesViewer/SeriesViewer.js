// @flow
import React from 'react';
import BookIcon from 'react-icons/lib/md/book';
import { type SeriesData } from 'store/modules/series';
import './SeriesViewer.scss';
import HorizontalUserInfo from '../../common/HorizontalUserInfo/HorizontalUserInfo';
import SeriesPostItem from '../SeriesPostItem/SeriesPostItem';

type Props = {
  series: SeriesData,
};
const SeriesViewer = ({ series }: Props) => {
  return (
    <div className="SeriesViewer">
      <HorizontalUserInfo user={series.user} />
      <div className="series-label">
        <BookIcon />
        <span>SERIES</span>
      </div>
      <h1>{series.name}</h1>
      <div className="list">
        {series.posts.map(p => (
          <SeriesPostItem key={p.id} post={p} username={series.user.username} />
        ))}
      </div>
    </div>
  );
};

export default SeriesViewer;
