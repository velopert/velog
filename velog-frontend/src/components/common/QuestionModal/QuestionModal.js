// @flow
import React from 'react';
import './QuestionModal.scss';
import ModalWrapper from '../ModalWrapper';
import Button from '../Button';

type Props = {
  title?: ?string,
  description: string,
  confirmText?: string,
  onConfirm: () => any,
  onCancel: () => any,
  open: boolean,
};

const QuestionModal = ({ title, description, confirmText, onConfirm, onCancel, open }: Props) => (
  <ModalWrapper open={open}>
    <div className="QuestionModal">
      <div className="modal-content">
        {title && <h4>{title}</h4>}
        <p>{description}</p>
        <div className="button-area">
          <Button cancel onClick={onCancel}>
            취소
          </Button>
          <Button confirm onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  </ModalWrapper>
);

QuestionModal.defaultProps = {
  title: null,
  confirmText: '확인',
};

export default QuestionModal;
