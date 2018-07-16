// @flow
import React from 'react';
import moment from 'moment';

import './WriteExtraTempSaveItem.scss';

type Props = {
  title: string,
  date: string,
  onClick: () => Promise<*>,
};

const WriteExtraTempSaveItem = ({ title, date, onClick }: Props) => (
  <div className="WriteExtraTempSaveItem" onClick={onClick}>
    <div className="title">{title}</div>
    <div className="time">{moment(date).fromNow()}</div>
  </div>
);

export default WriteExtraTempSaveItem;
