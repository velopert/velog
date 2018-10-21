// @flow
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import CommentIcon from 'react-icons/lib/fa/comment';
import HeartIcon from 'react-icons/lib/fa/heart';
import FakeLink from 'components/common/FakeLink';
import { type UserHistoryItem } from 'store/modules/profile';
import { onlyUpdateForKeys } from 'recompose';
import './UserHistory.scss';

type HistoryItemProps = {
  username: string,
  item: UserHistoryItem,
};

const HistoryItem = onlyUpdateForKeys(['item', 'username'])(
  ({ item, username }: HistoryItemProps) => {
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
              {item.post.short_description && item.post.short_description.slice(0, 150)}
              {item.post.short_description && item.post.short_description.length >= 150 && '...'}
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
  },
);

const HistoryItemPlaceholder = () => {
  return (
    <div className="HistoryItem placeholder">
      <div className="message gray-box" style={{ width: '60%' }} />
      <div className="mini-postcard">
        <div className="thumbnail">
          <div className="fake-img gray-box" />
        </div>
        <div className="separator" />
        <div className="post-info">
          <h4>
            <span className="gray-box" style={{ width: '60%' }} />
          </h4>
          <p>
            <span className="gray-box" style={{ width: '90%' }} />
            <span className="gray-box" style={{ width: '100%' }} />
            <span className="gray-box" style={{ width: '95%' }} />
          </p>
        </div>
      </div>
    </div>
  );
};

type Props = {
  username: ?string,
  data: ?(UserHistoryItem[]),
  loading: boolean,
};
class UserHistory extends Component<Props> {
  renderList() {
    const { username, data } = this.props;
    if (!data || !username) return null;
    return data.map(item => <HistoryItem username={username} item={item} key={item.id} />);
  }
  render() {
    return (
      <div className="UserHistory">
        {this.props.data &&
          this.props.data.length === 0 &&
          !this.props.loading && <div className="no-history">활동 내역이 없습니다.</div>}
        {this.renderList()}
        {this.props.loading && (
          <Fragment>
            <HistoryItemPlaceholder />
            <HistoryItemPlaceholder />
            <HistoryItemPlaceholder />
            <HistoryItemPlaceholder />
          </Fragment>
        )}
      </div>
    );
  }
}

export default onlyUpdateForKeys(['username', 'data', 'loading'])(UserHistory);
