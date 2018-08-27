// @flow
import React, { Component } from 'react';
import TrendingIcon from 'react-icons/lib/md/trending-up';
import RecentIcon from 'react-icons/lib/md/access-time';
import TagIcon from 'react-icons/lib/md/label-outline';

import './MainMobileHead.scss';
import MainMobileHeadItem from '../MainMobileHeadItem';

type Props = {
  url: string,
};

class MainMobileHead extends Component<Props> {
  render() {
    const { url } = this.props;
    return (
      <div className="MainMobileHead">
        <MainMobileHeadItem
          active={['/', '/trending'].indexOf(url) > -1}
          to="/trending"
          name="트렌딩"
        />
        <MainMobileHeadItem active={url === '/recent'} to="/recent" name="최신" />
        <MainMobileHeadItem active={/^\/tags/.test(url)} to="/tags" name="태그" />
      </div>
    );
  }
}

export default MainMobileHead;
