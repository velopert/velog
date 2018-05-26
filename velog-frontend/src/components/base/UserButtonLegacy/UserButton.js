// @flow
import React from 'react';
import defaultThumbnail from 'static/images/default_thumbnail.png';
import './UserButton.scss';

type Props = {
  onClick(): void,
  thumbnail: string,
};

const UserButton = ({ onClick, thumbnail }: Props) => {
  return (
    <div className="user-button">
      <div className="thumbnail" onClick={onClick}>
        <img src={thumbnail || defaultThumbnail} alt="thumbnail" />
      </div>
    </div>
  );
};

export default UserButton;
