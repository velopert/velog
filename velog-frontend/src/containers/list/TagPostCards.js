// @flow
import React, { Component } from 'react';
import PostCardList from 'components/common/PostCardList/PostCardList';
import type { State } from 'store';
import { ListingActions } from 'store/actionCreators';
import type { PostItem } from 'store/modules/listing';
import { connect } from 'react-redux';
import throttle from 'lodash/throttle';
import { getScrollBottom, preventStickBottom } from 'lib/common';

type Props = {
  posts: ?(PostItem[]),
  prefetched: ?(PostItem[]),
  prefetching: boolean,
  loading: boolean,
  width: number,
  hasEnded: boolean,
  selectedTag: ?{
    name: string,
    posts_count: string,
  },
};

class TagPostCards extends Component<Props> {
  prevCursor: ?string = null;

  prefetch = async () => {
    const { posts, prefetching, loading, selectedTag } = this.props;
    if (!selectedTag || !posts || posts.length === 0 || prefetching || loading) return;
    const lastId = posts[posts.length - 1].id;
    if (this.props.prefetched) {
      ListingActions.revealPrefetched('tag');
      await Promise.resolve(); // next tick
    }
    if (lastId === this.prevCursor) return;
    this.prevCursor = lastId;
    try {
      await ListingActions.prefetchTagPosts({
        cursor: lastId,
        tag: selectedTag.name,
      });
    } catch (e) {
      console.log(e);
    }
    preventStickBottom();
    this.onScroll();
  };

  initialize = async () => {
    const { selectedTag } = this.props;
    if (!selectedTag) return;
    try {
      await ListingActions.getTagPosts({
        tag: selectedTag.name,
      });
      this.prefetch();
    } catch (e) {
      console.log(e);
    }
  };

  onScroll = throttle(() => {
    const scrollBottom = getScrollBottom();
    if (scrollBottom > 1000) return;
    this.prefetch();
  }, 250);

  listenScroll = () => {
    window.addEventListener('scroll', this.onScroll);
  };

  unlistenScroll = () => {
    window.removeEventListener('scroll', this.onScroll);
  };

  componentDidMount() {
    this.initialize();
    this.listenScroll();
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedTag !== prevProps.selectedTag) {
      this.initialize();
    }
  }

  componentWillUnmount() {
    this.unlistenScroll();
  }

  render() {
    return (
      <PostCardList
        posts={this.props.posts}
        loading={this.props.loading}
        prefetching={!!this.props.prefetched || this.props.prefetching}
        width={this.props.width}
        hasEnded={this.props.hasEnded}
      />
    );
  }
}

const mapStateToProps = ({ listing, pender, base, common }: State) => ({
  posts: listing.tag.posts,
  prefetched: listing.tag.prefetched,
  prefetching: pender.pending['listing/PREFETCH_TAG_POSTS'],
  loading: pender.pending['listing/GET_TAG_POSTS'],
  width: base.windowWidth,
  hasEnded: listing.tag.end,
  selectedTag: common.tags.selected,
});

export default connect(mapStateToProps, () => ({}))(TagPostCards);
