// @flow
import React, { Component, type Node } from 'react';
import TempIcon from 'react-icons/lib/md/priority-high';
import TrendingIcon from 'react-icons/lib/md/trending-up';
import RecentIcon from 'react-icons/lib/md/access-time';
import CollectionIcon from 'react-icons/lib/md/collections-bookmark';
import TagIcon from 'react-icons/lib/md/label-outline';
import StoredIcon from 'react-icons/lib/md/play-for-work';
import { Link, withRouter, type Match } from 'react-router-dom';

import MainMenuItem from 'components/main/MainMenuItem';

import './MainSidebar.scss';

type Props = {
  url: string,
  searchBox: Node,
};

class MainSidebar extends Component<Props> {
  render() {
    const { url } = this.props;

    return (
      <aside className="MainSidebar">
        <Link to="/" className="logo">
          velog
        </Link>
        {this.props.searchBox}
        <ul className="menu">
          <MainMenuItem
            icon={<TrendingIcon />}
            text="트렌딩"
            active={['/', '/trending'].indexOf(url) > -1}
            to="/trending"
          />
          <MainMenuItem
            active={url === '/recent'}
            icon={<RecentIcon />}
            text="최신 포스트"
            to="/recent"
          />
          {/* <MainMenuItem
            active={/^\/collections/.test(url)}
            icon={<CollectionIcon />}
            text="컬렉션"
            to="/collections"
          /> */}
          <MainMenuItem
            active={/^\/tags/.test(url)}
            icon={<TagIcon />}
            text="태그 목록"
            to="/tags"
          />
          {/* <MainMenuItem
            active={/^\/stored/.test(url)}
            icon={<StoredIcon />}
            text="보관함"
            to="stored"
          /> */}
        </ul>
        <div className="placer" />
        <div className="footer">
          <Link to="/policy/privacy">서비스 정책</Link>
        </div>
      </aside>
    );
  }
}

export default MainSidebar;
