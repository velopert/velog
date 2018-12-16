// @flow
import React, { Component } from 'react';
import './UserAbout.scss';
import MarkdownRender from '../../common/MarkdownRender/MarkdownRender';

type Props = {
  about: string,
  self: boolean,
};
type State = {};

class UserAbout extends Component<Props> {
  render() {
    const { about, self } = this.props;
    return (
      <div className="UserAbout">
        {about ? (
          <MarkdownRender body={about} />
        ) : (
          <div className="empty-about">
            <div className="text">소개가 작성되지 않았습니다.</div>
            {self && (
              <div className="btn-wrapper">
                <button>작성하기</button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default UserAbout;
