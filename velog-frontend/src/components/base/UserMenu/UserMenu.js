// @flow
import React from 'react';
import withClickOutside from 'react-onclickoutside';
import { Link } from 'react-router-dom';
import UserMenuItem from 'components/base/UserMenuItem';
import './UserMenu.scss';

type Props = {
  onClick(): void,
  onLogout(): Promise<*>,
  username: string,
};

const UserMenu = ({ onClick, onLogout, username }: Props) => {
  return (
    <div className="user-menu-wrapper">
      <div className="user-menu-positioner">
        <div className="rotated-square" />
        <div className="user-menu" onClick={onClick}>
          <div className="menu-items">
            <UserMenuItem to={`/@${username}`}>내 벨로그</UserMenuItem>
            <div className="separator" />
            <UserMenuItem to="/write">새 글 작성</UserMenuItem>
            <UserMenuItem to="/saves">임시 글</UserMenuItem>
            <div className="separator" />
            <UserMenuItem to="/settings">설정</UserMenuItem>
            <UserMenuItem onClick={onLogout}>로그아웃</UserMenuItem>
          </div>
        </div>
      </div>
    </div>
  );
};

// $FlowFixMe
export default withClickOutside(UserMenu, {
  handleClickOutside(instance) {
    return instance.props.onClickOutside;
  },
});
