// @flow
import React from 'react';
import ModalWrapper from 'components/common/ModalWrapper';
import './CategoryEditModal.scss';


const CategoryEditModal = () => {
  return (
    <ModalWrapper className="CategoryEditModal">
      <h2>카테고리 수정</h2>
      <div className="content">
        욕심쟁이 욕심부려
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
};

export default CategoryEditModal;
