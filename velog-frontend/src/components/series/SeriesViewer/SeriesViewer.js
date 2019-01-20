// @flow
import React from 'react';
import { type SeriesData } from 'store/modules/series';
import './SeriesViewer.scss';
import SeriesPostItem from '../SeriesPostItem/SeriesPostItem';

type Props = {
  series: SeriesData,
  ownSeries: boolean,
  onEnableEditing: () => void,
  onAskRemove: () => void,
};
const SeriesViewer = ({ series, onEnableEditing, onAskRemove, ownSeries }: Props) => {
  return (
    <div className="SeriesViewer">
      <h1>{series.name}</h1>
      {ownSeries && (
        <div className="manage">
          <button className="text-btn" onClick={onEnableEditing}>
            수정
          </button>
          <button className="text-btn" onClick={onAskRemove}>
            삭제
          </button>
        </div>
      )}
      <div className="list">
        {series.posts.map(p => (
          <SeriesPostItem key={p.id} post={p} username={series.user.username} />
        ))}
      </div>
    </div>
  );
};

export default SeriesViewer;
