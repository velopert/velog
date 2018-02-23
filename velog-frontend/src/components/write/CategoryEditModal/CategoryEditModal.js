// @flow
import React, { Component, type Node } from 'react';
import PerfectScrollbar from 'perfect-scrollbar';
import ModalWrapper from 'components/common/ModalWrapper';
import './CategoryEditModal.scss';

type Props = {
  children: Node,
};

class CategoryEditModal extends Component<Props> {
  content: any = null;

  componentDidMount() {
    const ps = new PerfectScrollbar(this.content);
  }

  render() {
    const { children } = this.props;
    return (
      <ModalWrapper className="CategoryEditModal">
        <h2>카테고리 수정</h2>
        <div className="content" ref={(ref) => { this.content = ref; }}>
          {children}
        </div>
        <div className="foot">
          <div className="button cancel">
            취소
          </div>
          <div className="button save">
            저장
          </div>
        </div>
      </ModalWrapper>
    );
  }
}

export default CategoryEditModal;
