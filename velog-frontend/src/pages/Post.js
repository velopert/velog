// @flow
import React from 'react';
import PostTemplate from 'components/post/PostTemplate';
import HeaderContainer from 'containers/base/HeaderContainer';
import PostViewer from 'containers/post/PostViewer';
import { type Match } from 'react-router-dom';
import ViewerHead from 'components/base/ViewerHead';
import RightCorner from 'containers/base/RightCorner';

type Props = {
  match: Match,
};

const Post = ({ match }: Props) => {
  const { username, urlSlug } = match.params;

  return (
    <PostTemplate header={<ViewerHead rightCorner={<RightCorner />} />}>
      <PostViewer username={username} urlSlug={urlSlug} />
    </PostTemplate>
  );
};

export default Post;
