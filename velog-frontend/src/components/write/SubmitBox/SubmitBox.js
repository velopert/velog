// @flow
import React, { Component } from 'react';
import './SubmitBox.scss';

type Props = {
  isEditing: boolean,
  selectCategory: any,
  inputTags: any,
};
class SubmitBox extends Component<Props> {
  static defaultProps = {
    isEditing: false,
  }
  render() {
    const { isEditing, selectCategory, inputTags } = this.props;

    return (
      <div className="SubmitBox">
        <div className="title">
          {isEditing ? '수정하기' : '새 글 작성하기'}
        </div>
        <div className="sections">
          <section>
            <div className="section-title">
              카테고리 선택
            </div>
            {selectCategory}
          </section>
          <section>
            <div className="section-title">
              태그 설정
            </div>
            {inputTags}
          </section>
        </div>
      </div>
    );
  }
}

export default SubmitBox;