// @flow
import React from 'react';
import { type TagCountInfo } from 'store/modules/profile';
import './UserSide.scss';

type Props = {
  tagCounts: ?(TagCountInfo[]),
};

const UserSide = ({ tagCounts }: Props) => (
  <div className="UserSide">
    <section>
      <div className="section-title">태그</div>
      {tagCounts && (
        <ul>
          {tagCounts.map(t => (
            <li key={t.tag}>
              {t.tag}
              <span className="count">({t.count})</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  </div>
);

export default UserSide;
