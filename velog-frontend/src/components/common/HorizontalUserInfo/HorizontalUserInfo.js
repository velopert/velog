// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { resizeImage } from 'lib/common';
import defaultThumbnail from 'static/images/default_thumbnail.png';

import './HorizontalUserInfo.scss';

type Props = {
  user: {
    username: string,
    id: string,
    thumbnail: ?string,
    short_bio: ?string,
  },
};
const HorizontalUserInfo = ({ user }: Props) => {
  const userLink = `/@${user.username}`;
  return (
    <div className="HorizontalUserInfo">
      <Link to={userLink} className="user-thumbnail">
        <img src={resizeImage(user.thumbnail || defaultThumbnail, 128)} alt="user-thumbnail" />
      </Link>
      <div className="info">
        <Link to={userLink} className="username">
          @{user.username}
        </Link>
        <div className="description">{user.short_bio}</div>
      </div>
    </div>
  );
};

HorizontalUserInfo.Placeholder = () => {
  return (
    <div className="HorizontalUserInfo placeholder">
      <div className="user-thumbnail">
        <div className="fake-img" />
      </div>
      <div className="info">
        <div className="username">
          <div className="gray-block _username" />
        </div>
        <div className="description">
          <div className="gray-block _description" />
        </div>
      </div>
    </div>
  );
};

export default HorizontalUserInfo;
