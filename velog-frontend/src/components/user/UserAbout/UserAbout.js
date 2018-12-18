// @flow
import React, { Component, Fragment } from 'react';
import Button from 'components/common/Button';
import './UserAbout.scss';
import MarkdownRender from '../../common/MarkdownRender/MarkdownRender';

type Props = {
  about: string,
  self: boolean,
  onEditClick: () => void,
};
type State = {};

class UserAbout extends Component<Props> {
  render() {
    const { about, self, onEditClick } = this.props;
    return (
      <div className="UserAbout">
        {about ? (
          <Fragment>
            {self && (
              <div className="edit-btn-wrapper">
                <Button onClick={onEditClick}>수정하기</Button>
              </div>
            )}
            <MarkdownRender body={about} />
          </Fragment>
        ) : (
          <div className="empty-about">
            <div className="text">소개가 작성되지 않았습니다.</div>
            {self && (
              <div className="btn-wrapper">
                <button onClick={onEditClick}>작성하기</button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default UserAbout;
