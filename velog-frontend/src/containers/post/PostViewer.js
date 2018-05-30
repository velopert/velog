// @flow
import React, { Component, Fragment } from 'react';
import PostHead from 'components/post/PostHead';
import PostContent from 'components/post/PostContent';
import PostTags from 'components/post/PostTags';
import { PostsActions } from 'store/actionCreators';
import { connect } from 'react-redux';
import type { State } from 'store';
import type { PostData } from 'store/modules/posts';

type Props = {
  username: ?string,
  urlSlug: ?string,
  post: ?PostData,
};

class PostViewer extends Component<Props> {
  initialize = async () => {
    const { username, urlSlug } = this.props;
    if (!username || !urlSlug) return;
    try {
      PostsActions.readPost({
        username,
        urlSlug,
      });
    } catch (e) {
      console.log(e);
    }
  };

  componentDidMount() {
    this.initialize();
  }

  render() {
    const { post } = this.props;

    if (!post) return null;

    return (
      <Fragment>
        <PostHead
          title={post.title}
          tags={post.tags}
          categories={post.categories}
          user={post.user}
        />
        <PostContent body={post.body} />
        <PostTags tags={post.tags} />
      </Fragment>
    );
  }
}

export default connect(
  ({ posts }: State) => ({
    post: posts.post,
  }),
  () => ({}),
)(PostViewer);
