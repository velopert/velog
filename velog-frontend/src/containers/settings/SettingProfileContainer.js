// @flow
import React, { Component } from 'react';
import * as actions from 'store/actionCreators';
import type { State } from 'store';
import { connect } from 'react-redux';
import SettingProfile from 'components/settings/SettingProfile/SettingProfile';

type Props = {};

class SettingProfileContainer extends Component<Props> {
  render() {
    return <SettingProfile />;
  }
}

export default connect((state: State) => ({}), () => ({}))(SettingProfileContainer);
