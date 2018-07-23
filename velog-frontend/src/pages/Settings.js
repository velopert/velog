// @flow
import React from 'react';
import SettingsTemplate from 'components/settings/SettingsTemplate';
import WhiteHeader from 'containers/base/WhiteHeader';
import SettingSections from 'containers/settings/SettingSections';

type Props = {};

const Settings = (props: Props) => {
  return (
    <SettingsTemplate header={<WhiteHeader />}>
      <SettingSections />
    </SettingsTemplate>
  );
};

export default Settings;
