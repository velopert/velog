// @flow
import React from 'react';
import EmptyNotifIcon from 'react-icons/lib/io/android-notifications-none';
import ActiveNotifIcon from 'react-icons/lib/io/android-notifications';
import cx from 'classnames';

import './NotificationButton.scss';

type Props = {
  count: number,
  onClick(): void,
};

const NotificationButton = ({ count, onClick }: Props) => {
  const active = count > 0;
  const Icon = active ? ActiveNotifIcon : EmptyNotifIcon;
  return (
    <button className={cx('NotificationButton', { active })}>
      <Icon />
      {active && <div className="count">{count > 9 ? '9+' : count}</div>}
    </button>
  );
};

NotificationButton.defaultProps = {
  count: 0,
};

export default NotificationButton;
