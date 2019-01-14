// @flow
import React, { Fragment } from 'react';

import PostViewer from 'containers/post/PostViewer';
import { type Match } from 'react-router-dom';
import ViewerHead from 'components/base/ViewerHead';
import PostCommentsContainer from 'containers/post/PostCommentsContainer';
import PostSequencesContainer from 'containers/post/PostSequencesContainer';
import PlainTemplate from '../components/common/PlainTemplate';

type Props = {
  match: Match,
};

const Post = ({ match }: Props) => {
  const { username, urlSlug } = match.params;

  return (
    <Fragment>
      <PlainTemplate header={<ViewerHead />}>
        <PostViewer username={username} urlSlug={decodeURI(urlSlug || '')} />
        <PostCommentsContainer />
      </PlainTemplate>
      <PostSequencesContainer username={username || ''} />
    </Fragment>
  );
};

export default Post;
