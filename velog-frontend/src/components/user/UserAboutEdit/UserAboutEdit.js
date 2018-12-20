// @flow
import React from 'react';
import MarkdownEditor from 'components/common/MarkdownEditor';
import Button from 'components/common/Button';
import './UserAboutEdit.scss';

type Props = {
  text: string,
  onChange: (text: string) => void,
  onSave: () => any,
  flash: string,
};

const UserAboutEdit = ({ text, onChange, onSave, flash }: Props) => {
  return (
    <div className="UserAboutEdit">
      <MarkdownEditor
        placeholder="자기소개를 작성해보세요.
* markdown을 사용 하실 수 있습니다."
        value={text}
        onChange={onChange}
        flash={flash}
      />
      <div className="btn-wrapper">
        <Button large onClick={onSave}>
          저장
        </Button>
      </div>
    </div>
  );
};

export default UserAboutEdit;
