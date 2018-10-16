// @flow
import React, { Component } from 'react';
import CommentIcon from 'react-icons/lib/fa/comment';
import HeartIcon from 'react-icons/lib/fa/heart';
import './UserHistory.scss';

type HistoryItemProps = {
  type: 'comment' | 'like',
};

const HistoryItem = ({ type }: HistoryItemProps) => {
  return (
    <div className="HistoryItem">
      <div className="message">
        <CommentIcon className="comment" />@velopert님이 댓글을 남기셨습니다.
      </div>
      <div className="mini-postcard">
        <div className="thumbnail">
          <img
            src="https://thumb.velog.io/resize?url=https://images.velog.io/post-images/clarekang/75978a70-c53e-11e8-a8ba-eb98e52ccb66/cucumber.jpg&width=512"
            alt="thumbnail"
          />
        </div>
        <div className="separator" />
        <div className="post-info">
          <h4>제목이라능</h4>
          <p>
            쇼트 디스립션은 한 100자정도만 보여줄꺼지롱 나는 아무거나 쓸건데 이걸 쓰는 동안에는
            오타를 엄청나게 많이 낼 것이다. 왜냐하면 나는 아무 생각없이 쓰고 있기때문이고 지금 사실
            눈을 감고있다. 지금 드는 감정에 대해서 묘사를 하자면 음파음파 꼬르르이다.
          </p>
        </div>
      </div>
      <div className="comment-block">
        <div className="mark">“</div>
        <div className="comment-text">
          제 생각엔 제가 댓글을 달았는데 그게 진짜 댓글이 아니더라구요.. ㄷ 근데 문제는 그게
          무슨소리인지 모르겠다는거에요.
        </div>
      </div>
    </div>
  );
};

type Props = {};
class UserHistory extends Component<Props> {
  render() {
    return (
      <div className="UserHistory">
        <HistoryItem type="comment" />
        <HistoryItem type="comment" />
        <HistoryItem type="comment" />
        <HistoryItem type="comment" />
        <HistoryItem type="like" />
      </div>
    );
  }
}

export default UserHistory;
