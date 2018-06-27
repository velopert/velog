// @flow
import React, { Component } from 'react';
import * as actions from 'store/actionCreators';
import type { State } from 'store';
import { connect } from 'react-redux';
import UserHead from 'components/user/UserHead';

type Props = {};

class UserHeadContainer extends Component<Props> {
  render() {
    return <UserHead />;
  }
}

export default connect((state: State) => ({}), () => ({}))(UserHeadContainer);
