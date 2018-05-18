// @flow
import React, { Component } from 'react';
import PostCardList from 'components/common/PostCardList/PostCardList';
import type { State } from 'store';
import { ListingActions } from 'store/actionCreators';

class RecentPostCards extends Component<{}> {
  render() {
    return <PostCardList />;
  }
}

export default RecentPostCards;
