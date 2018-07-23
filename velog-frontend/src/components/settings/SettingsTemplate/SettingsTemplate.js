// @flow
import React, { type Node } from 'react';
import SettingIcon from 'react-icons/lib/md/settings';
import './SettingsTemplate.scss';

type Props = {
  header: Node,
  children: Node,
};

const SettingsTemplate = ({ header, children }: Props) => (
  <div className="SettingsTemplate">
    {header}
    <main>
      <h2>
        <SettingIcon />설정
      </h2>
      {children}
    </main>
  </div>
);

export default SettingsTemplate;
