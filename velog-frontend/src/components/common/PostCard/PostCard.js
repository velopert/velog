// @flow
import React from 'react';
import ImageIcon from 'react-icons/lib/io/image';
import './PostCard.scss';

type Props = {};

const PostCard = (props: Props) => (
  <div className="PostCard">
    <div className="thumbnail-wrapper">
      {/* <img
        src="https://velopert.com/wp-content/uploads/2018/04/shovel-copy-450x237.png"
        alt="thumbnail"
      /> */}
      <div className="image-placeholder">
        <ImageIcon />
      </div>
    </div>
    <div className="card-content">
      <div className="content-head">
        <h3>제목입니다. 제목인데 제목이 길면 그냥 그 다음줄로 가게 하자..</h3>
        <div className="subinfo">
          <span>5월 10일</span>
          <span>8개의 댓글</span>
        </div>
      </div>
      <div className="description">
        여기서는 최대 딱 세줄만 보여주도록 설정해야지 이 자리에 들어가는 설명은 커스터마이징 할 수도
        있고 내가 블로그 사용하면서 느꼈던게 실제로 포스트의 앞 부분이 이 자리에 들어간다는건데,
        포스트의 설명 !== 포스트의 내용 앞부분으로 구현하고싶다.
      </div>
    </div>
  </div>
);

export default PostCard;
