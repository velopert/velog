// @flow
import React from 'react';
import PageTemplate from 'components/base/PageTemplate';
import HeaderContainer from 'containers/base/HeaderContainer';
import PostViewer from 'containers/post/PostViewer';

const Post = () => {
  return (
    <PageTemplate header={<HeaderContainer />}>
      <PostViewer />
    </PageTemplate>
  );
};

export default Post;
