// @flow
import React from 'react';
import EmptyNotifIcon from 'react-icons/lib/io/android-notifications-none';
import ActiveNotifIcon from 'react-icons/lib/io/android-notifications';
import cx from 'classnames';

import './MainHeadNotifButton.scss';

type Props = {
  count: number,
  onClick(): void,
};

const MainHeadNotifButton = ({ count, onClick }: Props) => {
  const active = count > 0;
  const Icon = active ? ActiveNotifIcon : EmptyNotifIcon;
  return (
    <button className={cx('MainHeadNotifButton', { active })}>
      <Icon />
      {active && <div className="count">{count > 9 ? '9+' : count}</div>}
    </button>
  );
};

MainHeadNotifButton.defaultProps = {
  count: 0,
};

export default MainHeadNotifButton;
