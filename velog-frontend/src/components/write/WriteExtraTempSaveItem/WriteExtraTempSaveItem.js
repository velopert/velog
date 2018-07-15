// @flow
import React from 'react';
import moment from 'moment';

import './WriteExtraTempSaveItem.scss';

type Props = {
  id: string,
  title: string,
  date: string,
};

const WriteExtraTempSaveItem = ({ id, title, date }: Props) => (
  <div className="WriteExtraTempSaveItem">
    <div className="title">{title}</div>
    <div className="time">{moment(date).fromNow()}</div>
  </div>
);

export default WriteExtraTempSaveItem;
