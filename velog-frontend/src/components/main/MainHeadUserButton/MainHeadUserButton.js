// @flow
import React from 'react';
import defaultThumbnail from 'static/images/default_thumbnail.png';
import './MainHeadUserButton.scss';

type Props = {
  onClick(): void,
  thumbnail: ?string,
};

const MainHeadUserButton = ({ onClick, thumbnail }: Props) => {
  return (
    <div className="MainHeadUserButton">
      <div className="thumbnail" onClick={onClick}>
        <img src={thumbnail || defaultThumbnail} alt="thumbnail" />
      </div>
    </div>
  );
};

MainHeadUserButton.defaultProps = {
  thumbnail: defaultThumbnail,
};

export default MainHeadUserButton;
