// @flow
import React, { Component } from 'react';
import './SettingProfileLink.scss';

type Props = {
  label: string,
  name: string,
  value: string,
  templateURL?: string,
  onChange: (e: any) => any,
};

class SettingProfileLink extends Component<Props> {
  render() {
    const { label, name, value, templateURL, onChange } = this.props;
    return (
      <div className="SettingProfileLink">
        <div className="label">{label}</div>
        <div className="input-wrapper">
          {templateURL && <div className="template-url">{templateURL}</div>}
          <input value={value} name={name} onChange={onChange} />
        </div>
      </div>
    );
  }
}

export default SettingProfileLink;
