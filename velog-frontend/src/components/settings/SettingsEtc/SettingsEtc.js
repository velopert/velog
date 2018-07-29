// @flow
import React from 'react';
import Button from 'components/common/Button';
import './SettingsEtc.scss';

type Props = {
  onAskUnregister: () => void,
};

const SettingsEtc = ({ onAskUnregister }: Props) => (
  <div className="SettingsEtc">
    <section>
      <Button theme="outline" color="red" onClick={onAskUnregister}>
        회원 탈퇴
      </Button>
    </section>
  </div>
);

export default SettingsEtc;
