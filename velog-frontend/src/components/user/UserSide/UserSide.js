// @flow
import React from 'react';
import { type TagCountInfo } from 'store/modules/profile';
import { NavLink } from 'react-router-dom';
import { escapeForUrl } from 'lib/common';

import './UserSide.scss';

type Props = {
  tagCounts: ?(TagCountInfo[]),
  username: string,
  onSelectTag: (tagName: string) => void,
};

const UserSide = ({ tagCounts, username, onSelectTag }: Props) => (
  <div className="UserSide">
    <section>
      <div className="section-title">태그</div>
      {tagCounts && (
        <ul>
          <li>
            <NavLink exact to={`/@${username}`} activeStyle={{ fontWeight: '600' }}>
              전체보기
            </NavLink>
          </li>
          {tagCounts.map(t => (
            <li key={t.tag}>
              <NavLink
                activeStyle={{ fontWeight: '600' }}
                to={`/@${username}/tags/${escapeForUrl(t.tag)}`}
                onClick={() => onSelectTag(t.tag)}
              >
                {t.tag}
                <span className="count">({t.count})</span>
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </section>
  </div>
);

export default UserSide;
