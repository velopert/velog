// @flow
import React, { Component } from 'react';
import TempIcon from 'react-icons/lib/md/priority-high';
import TrendingIcon from 'react-icons/lib/md/trending-up';
import RecentIcon from 'react-icons/lib/md/access-time';
import CollectionIcon from 'react-icons/lib/md/collections-bookmark';
import TagIcon from 'react-icons/lib/md/label-outline';
import StoredIcon from 'react-icons/lib/md/play-for-work';

import MainMenuItem from 'components/main/MainMenuItem';

import './MainSidebar.scss';

type Props = {};

class MainSidebar extends Component<Props> {
  render() {
    return (
      <aside className="MainSidebar">
        <div className="logo">velog</div>
        <ul className="menu">
          <MainMenuItem
            icon={<TrendingIcon />}
            text="트렌딩"
            active
          />
          <MainMenuItem
            icon={<RecentIcon />}
            text="최신 포스트"
          />
          <MainMenuItem
            icon={<CollectionIcon />}
            text="컬렉션"
          />
          <MainMenuItem
            icon={<TagIcon />}
            text="태그 목록"
          />
          <MainMenuItem
            icon={<StoredIcon />}
            text="보관함"
          />
        </ul>
      </aside>
    );
  }
}

export default MainSidebar;
