// @flow
import React from 'react';
import BackIcon from 'react-icons/lib/md/arrow-back';
import MoreIcon from 'react-icons/lib/md/more-vert';
import EditorLeftPaneIcon from 'components/icons/EditorLeftPaneIcon';
import EditorRightPaneIcon from 'components/icons/EditorRightPaneIcon';
import EditorBothPanesIcon from 'components/icons/EditorBothPanesIcon';
import CloseIcon from 'react-icons/lib/md/close';
import cx from 'classnames';
import ImageIcon from 'react-icons/lib/io/image';
import Tooltip from 'react-tooltip';
import './WriteHeader.scss';

type Props = {
  onChangeTitle(e: any): void,
  onUploadClick(): void,
  onOpenSubmitBox(): void,
  onShowWriteExtra(): void,
  onHideWriteExtra(e: SyntheticMouseEvent<any>): void,
  onGoBack(): void,
  writeExtraOpen: boolean,
  title: string,
  isEdit: boolean,
};
const WriteHeader = ({
  onChangeTitle,
  onOpenSubmitBox,
  onUploadClick,
  onShowWriteExtra,
  onHideWriteExtra,
  onGoBack,
  writeExtraOpen,
  title,
  isEdit,
}: Props) => {
  return (
    <div className="WriteHeader">
      <BackIcon className="back-icon" onClick={onGoBack} />
      <div className="title-area">
        <input placeholder="제목을 입력해주세요" autoFocus onChange={onChangeTitle} value={title} />
      </div>
      <div className="actions">
        <button className="upload-image" onClick={onUploadClick}>
          <ImageIcon />
          <div className="btn-text">업로드</div>
        </button>
        <div className={cx('button', isEdit ? 'edit' : 'submit')} onClick={onOpenSubmitBox}>
          {isEdit ? '업데이트' : '작성하기'}
        </div>
        {writeExtraOpen && (
          <div className="ignore-click-outside more util flex-center" onClick={onHideWriteExtra}>
            <CloseIcon className="ignore-click-outside" />
          </div>
        )}
        {!writeExtraOpen && (
          <div className="ignore-click-outside more util flex-center" onClick={onShowWriteExtra}>
            <MoreIcon className="ignore-click-outside" />
          </div>
        )}
      </div>
    </div>
  );
};

export default WriteHeader;
