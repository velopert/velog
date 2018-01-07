// @flow
import React from 'react';
import defaultThumbnail from 'static/images/default_thumbnail.png';
import './UserButton.scss';

type Props = {
  onClick(): void
}

const UserButton = ({ onClick }: Props) => {
  return (
    <div className="user-button">
      <div className="thumbnail" onClick={onClick}>
        <img src={defaultThumbnail} alt="thumbnail" />
      </div>
    </div>
  );
};

export default UserButton;
