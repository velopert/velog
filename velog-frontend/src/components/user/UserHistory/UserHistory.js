// @flow
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import CommentIcon from 'react-icons/lib/fa/comment';
import HeartIcon from 'react-icons/lib/fa/heart';
import FakeLink from 'components/common/FakeLink';
import { type UserHistoryItem } from 'store/modules/profile';
import './UserHistory.scss';

type HistoryItemProps = {
  username: string,
  item: UserHistoryItem,
};

const HistoryItem = ({ item, username }: HistoryItemProps) => {
  const url = `/@${item.post.user.username}/${item.post.url_slug}`;
  const { type } = item;
  return (
    <FakeLink className="HistoryItem" to={url}>
      {type === 'comment' ? (
        <div className="message">
          <CommentIcon className="comment" />@{username}님이 댓글을 남기셨습니다.
        </div>
      ) : (
        <div className="message">
          <HeartIcon className="heart" />
          @{username}님이 이 포스트를 좋아합니다.
        </div>
      )}
      <div className="mini-postcard">
        {item.post.thumbnail && (
          <Fragment>
            <div className="thumbnail">
              <img src={item.post.thumbnail} alt="thumbnail" />
            </div>
            <div className="separator" />
          </Fragment>
        )}
        <div className="post-info">
          <h4>
            <Link to={url}>{item.post.title}</Link>
          </h4>
          <p>
            {item.post.short_description.slice(0, 150)}
            {item.post.short_description.length >= 150 && '...'}
          </p>
        </div>
      </div>
      {type === 'comment' && (
        <div className="comment-block">
          <div className="mark">“</div>
          <div className="comment-text">{item.text}</div>
        </div>
      )}
    </FakeLink>
  );
};

type Props = {
  username: string,
  data: UserHistoryItem[],
};
class UserHistory extends Component<Props> {
  renderList() {
    const { username, data } = this.props;
    return data.map(item => <HistoryItem username={username} item={item} key={item.id} />);
  }
  render() {
    return <div className="UserHistory">{this.renderList()}</div>;
  }
}

export default UserHistory;
