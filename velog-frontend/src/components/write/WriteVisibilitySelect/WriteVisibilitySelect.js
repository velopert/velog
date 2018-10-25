// @flow
import React, { Component } from 'react';
import GlobeIcon from 'react-icons/lib/io/android-globe';
import LockIcon from 'react-icons/lib/md/lock';
import cx from 'classnames';

import './WriteVisibilitySelect.scss';

type Props = {};
type State = {
  selected: 'public' | 'private',
};

class WriteVisibilitySelect extends Component<Props, State> {
  state = {
    selected: 'public',
  };
  handleSelect = (selected: 'public' | 'private') => {
    this.setState({
      selected,
    });
  };
  render() {
    const { selected } = this.state;
    return (
      <div className="WriteVisibilitySelect">
        <div
          className={cx('item', { active: selected === 'public' })}
          onClick={() => this.handleSelect('public')}
        >
          <div className="item-content">
            <GlobeIcon />전체 공개
          </div>
        </div>
        <div
          className={cx('item', { active: selected === 'private' })}
          onClick={() => this.handleSelect('private')}
        >
          <div className="item-content">
            <LockIcon />나만 보기
          </div>
        </div>
        <div className={cx('active-slider', { right: this.state.selected === 'private' })} />
      </div>
    );
  }
}

export default WriteVisibilitySelect;
