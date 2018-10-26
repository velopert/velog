// @flow
import React, { Component } from 'react';
import GlobeIcon from 'react-icons/lib/io/android-globe';
import LockIcon from 'react-icons/lib/md/lock';
import cx from 'classnames';

import './WriteVisibilitySelect.scss';

type Props = {
  isPrivate: boolean,
  onSelect: (isPrivate: boolean) => any,
};
type State = {
  selected: 'public' | 'private',
};

class WriteVisibilitySelect extends Component<Props, State> {
  render() {
    const { isPrivate, onSelect } = this.props;
    return (
      <div className="WriteVisibilitySelect">
        <div className={cx('item', { active: !isPrivate })} onClick={() => onSelect(false)}>
          <div className="item-content">
            <GlobeIcon />전체 공개
          </div>
        </div>
        <div className={cx('item', { active: isPrivate })} onClick={() => onSelect(true)}>
          <div className="item-content">
            <LockIcon />나만 보기
          </div>
        </div>
        <div className={cx('active-slider', { right: isPrivate })} />
      </div>
    );
  }
}

export default WriteVisibilitySelect;
