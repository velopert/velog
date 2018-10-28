// @flow
import React, { Fragment } from 'react';
import PostCard from 'components/common/PostCard';
import type { PostItem } from 'store/modules/listing';
import FakePostCard from 'components/common/FakePostCard';
import './PostCardList.scss';

type Props = {
  posts?: ?(PostItem[]),
  loading: boolean,
  prefetching: boolean,
  width?: number,
  hasEnded: boolean,
  oneColumn?: boolean,
  placeholderCount?: number,
  hideUsername?: boolean,
};

const createArray = length => Array.from(Array(length).keys());
const getColumnCount = (width) => {
  const xWide = 1920;
  const wide = 1600;
  const xLarge = 1200;
  const large = 1024;

  if (!width) return 1;

  if (width < large) return 1;
  if (width < xLarge) return 2;
  if (width < wide) return 3;
  if (width < xWide) return 4;
  return 5;
};

const PostCardList = ({
  posts,
  loading,
  prefetching,
  width,
  hasEnded,
  oneColumn,
  placeholderCount,
  hideUsername,
}: Props) => {
  if (loading) {
    return (
      <div className="PostCardList">
        {createArray(placeholderCount).map(num => <FakePostCard key={num} oneColumn={oneColumn} />)}
      </div>
    );
  }

  const columnCount = oneColumn ? 1 : getColumnCount(width);

  if (!posts) return null;
  const postList = (hasEnded || posts.length <= 20
    ? posts
    : posts.slice(0, posts.length - posts.length % columnCount)
  ).map(post => (
    <PostCard
      key={post.id}
      id={post.id}
      thumbnail={post.thumbnail}
      username={post.user.username}
      userThumbnail={post.user.thumbnail}
      title={post.title}
      body={(post.meta && post.meta.short_description) || post.body}
      date={post.released_at}
      urlSlug={post.url_slug}
      oneColumn={oneColumn}
      commentsCount={post.comments_count}
      isPrivate={post.is_private}
      hideUsername={hideUsername}
    />
  ));

  return (
    <Fragment>
      <div className="PostCardList">
        {postList &&
          postList.length === 0 && <div className="empty-list">아직 작성한 포스트가 없습니다.</div>}
        {postList}
        {prefetching &&
          createArray(columnCount).map(num => <FakePostCard key={num} oneColumn={oneColumn} />)}
      </div>
    </Fragment>
  );
};

PostCardList.defaultProps = {
  posts: [],
  oneColumn: false,
  width: 0,
  placeholderCount: 10,
  hideUsername: false,
};

export default PostCardList;
