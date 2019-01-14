// @flow
import React from 'react';
import './SeriesViewer.scss';
import HorizontalUserInfo from '../../common/HorizontalUserInfo/HorizontalUserInfo';

type Props = {};
const SeriesViewer = (props: Props) => {
  return (
    <div className="SeriesViewer">
      <HorizontalUserInfo.Placeholder />
    </div>
  );
};

export default SeriesViewer;
