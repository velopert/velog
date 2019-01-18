// @flow
import React from 'react';
import { fromNow } from 'lib/common';
import { type SeriesItemData } from 'store/modules/profile';
import { Link } from 'react-router-dom';
import './UserSeriesListItem.scss';

type Props = {
  series: SeriesItemData,
};
const UserSeriesListItem = ({ series }: Props) => {
  const formattedDate = fromNow(series.updated_at);
  const { username } = series.user;
  const url = `/@${username}/series/${series.url_slug}`;
  return (
    <div className="UserSeriesListItem">
      <div className="content">
        <h3>
          <Link to={url}>{series.name}</Link>
        </h3>
        <div className="meta">
          <div className="count">{series.posts_count}개의 포스트</div>
          <div className="updated">마지막 업데이트 {formattedDate}</div>
        </div>
      </div>
    </div>
  );
};

export default UserSeriesListItem;
