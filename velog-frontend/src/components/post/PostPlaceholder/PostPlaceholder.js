// @flow
import React, { Fragment } from 'react';
import PostHead from 'components/post/PostHead';
import './PostPlaceholder.scss';
import PostContent from '../PostContent';

type Props = {};

const PostPlaceholder = (props: Props) => (
  <Fragment>
    <PostHead.Placeholder />
    <PostContent.Placeholder />
  </Fragment>
);

export default PostPlaceholder;
