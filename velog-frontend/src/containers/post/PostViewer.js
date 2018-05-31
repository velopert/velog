// @flow
import React, { Component, Fragment } from 'react';
import PostHead from 'components/post/PostHead';
import PostContent from 'components/post/PostContent';
import PostTags from 'components/post/PostTags';
import { PostsActions } from 'store/actionCreators';
import { connect } from 'react-redux';
import type { State } from 'store';
import type { PostData, TocItem } from 'store/modules/posts';
import PostToc from 'components/post/PostToc';

type Props = {
  username: ?string,
  urlSlug: ?string,
  post: ?PostData,
  toc: ?(TocItem[]),
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

  onSetToc = (toc: ?(TocItem[])) => {
    PostsActions.setToc(toc);
  };

  componentDidMount() {
    this.initialize();
  }

  render() {
    const { post, toc } = this.props;
    const { onSetToc } = this;
    if (!post) return null;

    return (
      <Fragment>
        <PostToc toc={toc} />
        <PostHead
          title={post.title}
          tags={post.tags}
          categories={post.categories}
          user={post.user}
        />
        <PostContent body={post.body} onSetToc={onSetToc} />
        <PostTags tags={post.tags} />
      </Fragment>
    );
  }
}

export default connect(
  ({ posts }: State) => ({
    post: posts.post,
    toc: posts.toc,
  }),
  () => ({}),
)(PostViewer);
