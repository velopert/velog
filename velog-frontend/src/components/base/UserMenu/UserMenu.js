// @flow
import React from 'react';
import withClickOutside from 'react-onclickoutside';
import { Link } from 'react-router-dom';
import UserMenuItem from 'components/base/UserMenuItem';
import './UserMenu.scss';

const UserMenu = ({ onClick, onLogout }) => {
  return (
    <div className="user-menu-wrapper">
      <div className="user-menu-positioner">
        <div className="user-menu" onClick={onClick}>
          <div className="me">
            <div className="username">
              @velopert
            </div>
          </div>
          <div className="menu-items">
            <UserMenuItem>
              새 글 작성
            </UserMenuItem>
            <UserMenuItem>
              임시 글
            </UserMenuItem>
            <div className="separator" />
            <UserMenuItem>
              설정
            </UserMenuItem>
            <UserMenuItem onClick={onLogout}>
              로그아웃
            </UserMenuItem>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withClickOutside(UserMenu, {
  handleClickOutside(instance) {
    return instance.props.onClickOutside;
  },
});
