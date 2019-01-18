// @flow
import React, { type Node } from 'react';
import BookIcon from 'react-icons/lib/md/book';
import './SeriesTemplate.scss';
import HorizontalUserInfo from '../../common/HorizontalUserInfo/HorizontalUserInfo';

type Props = {
  user: {
    username: string,
    id: string,
    thumbnail: ?string,
    short_bio: ?string,
  },
  children: Node,
};

const SeriesTemplate = ({ user, children }: Props) => {
  return (
    <div className="SeriesTemplate">
      <HorizontalUserInfo user={user} />
      <div className="series-label">
        <BookIcon />
        <span>SERIES</span>
      </div>
      {children}
    </div>
  );
};

export default SeriesTemplate;
