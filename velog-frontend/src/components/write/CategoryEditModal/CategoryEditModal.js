// @flow
import React, { Component, type Node } from 'react';
import PerfectScrollbar from 'perfect-scrollbar';
import ModalWrapper from 'components/common/ModalWrapper';
import './CategoryEditModal.scss';

type Props = {
  open: boolean,
  children: Node,
  onClose(): void,
  onSave(): Promise<*>,
};

class CategoryEditModal extends Component<Props> {
  content: any = null;
  ps: any = null;

  setupScrollbar(): void {
    if (!this.content) return;

    if (this.ps) {
      // kill existing ps
      this.ps.destroy();
      this.ps = null;
    }

    this.ps = new PerfectScrollbar(this.content);
    window.ps = this.ps;
  }

  initialize(): void {
    this.setupScrollbar();
  }
  componentDidMount() {
    this.initialize();
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.open && this.props.open) {
      this.initialize();
    }
    this.setupScrollbar();
  }

  render() {
    const { children, open, onClose, onSave } = this.props;
    return (
      <ModalWrapper className="CategoryEditModal" open={open}>
        <h2>카테고리 수정</h2>
        <div className="content" ref={(ref) => { this.content = ref; }}>
          {children}
        </div>
        <div className="foot">
          <div className="button cancel" onClick={onClose}>
            취소
          </div>
          <div className="button save" onClick={onSave}>
            저장
          </div>
        </div>
      </ModalWrapper>
    );
  }
}

export default CategoryEditModal;
