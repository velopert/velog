// @flow
import React from 'react';
import Responsive from 'components/common/Responsive';
import type { Categories } from 'store/modules/posts';
import PostLikeButton from 'components/post/PostLikeButton';
import { Link } from 'react-router-dom';
import defaultThumbnail from 'static/images/default_thumbnail.png';
import { fromNow } from 'lib/common';
import PostActionButtons from '../PostActionButtons';
import './PostHead.scss';

type Props = {
  id: string,
  title: string,
  categories: Categories,
  user: {
    username: string,
    id: string,
    thumbnail: ?string,
    short_bio: ?string,
  },
  likes: number,
  liked: boolean,
  ownPost: boolean,
  onToggleLike: () => void,
  onAskRemove: () => void,
  date: string,
};

const PostHead = ({
  id,
  title,
  date,
  categories,
  user,
  likes,
  liked,
  ownPost,
  onToggleLike,
  onAskRemove,
}: Props) => {
  const userLink = `/@${user.username}`;

  return (
    <div className="PostHead">
      <div className="userinfo">
        <Link to={userLink} className="user-thumbnail">
          <img src={user.thumbnail || defaultThumbnail} alt="user-thumbnail" />
        </Link>
        <div className="info">
          <Link to={userLink} className="username">
            @{user.username}
          </Link>
          <div className="description">{user.short_bio}</div>
        </div>
      </div>
      <h1>{title}</h1>
      <div className="date-and-likes">
        <div className="date">{fromNow(date)}</div>
        <div className="placeholder" />
        <PostLikeButton onClick={onToggleLike} liked={liked} likes={likes} />
      </div>
      <div className="separator" />
      {ownPost && <PostActionButtons id={id} onAskRemove={onAskRemove} />}
    </div>
  );
};

/*
type Props = {
  title: string,
  tags: string[]
};

const PostHead = ({ title, tags }: Props) => (
  <div className="PostHead">
    <div className="sub-info">
      <div className="thumbnail util flex-center">
        <img
          src="https://avatars0.githubusercontent.com/u/17202261?v=4"
          alt="user-thumbnail"
        />
      </div>
      <div className="information">
        <div>
          <div className="username">@velopert</div>
          <div className="description">Frontend Engineer at Laftel Inc.</div>
          <div className="date-time">Mar 30</div>
        </div>
      </div>
    </div>
    <h1>
      {title}
    </h1>
    <div className="tags">
      {
        tags.map(tag => (<span className="tag" key={tag}>{tag}</span>))
      }
    </div>
  </div>
);
*/

export default PostHead;
