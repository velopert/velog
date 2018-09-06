// @flow
import React from 'react';
import DeleteIcon from 'react-icons/lib/md/delete';
import { fromNow } from 'lib/common';
import { Link } from 'react-router-dom';

import './SavePostCard.scss';

type Props = {
  thumbnail: ?string,
  id: string,
  title: string,
  updatedAt: string,
  onAskRemove: (postId: string) => void,
};

const SavePostCard = ({ id, thumbnail, title, updatedAt, onAskRemove }: Props) => (
  <div className="SavePostCard">
    {thumbnail && (
      <div className="img-wrapper">
        <img src={thumbnail} alt="thumbnail" />
      </div>
    )}
    <div className="white-area">
      <div className="post-info">
        <h3>
          <Link to={`/write?edit_id=${id}`}>{title}</Link>
        </h3>
        <div className="date">{fromNow(updatedAt)}</div>
      </div>
      <button className="remove-button" onClick={() => onAskRemove(id)}>
        <DeleteIcon />
      </button>
    </div>
  </div>
);

export default SavePostCard;
