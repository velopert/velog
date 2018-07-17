// @flow
import React from 'react';
import DeleteIcon from 'react-icons/lib/md/delete';
import './SavePostCard.scss';

type Props = {};

const SavePostCard = (props: Props) => (
  <div className="SavePostCard">
    <div className="img-wrapper">
      <img
        src="https://images.velog.io/post-images/velopert/1d26a150-6747-11e8-9dff-1b161279fc07/goodb.png"
        alt="thumbnail"
      />
    </div>
    <div className="white-area">
      <div className="post-info">
        <h3>제목이 있다리</h3>
        <div className="date">4 초 전</div>
      </div>
      <button className="remove-button">
        <DeleteIcon />
      </button>
    </div>
  </div>
);

export default SavePostCard;
