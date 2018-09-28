// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BaseActions } from 'store/actionCreators';
import { type State } from 'store';

import NotifyToast from '../../components/base/NotifyToast';

type Props = {
  toast: {
    type: ?string,
    message: ?string,
    visible: boolean,
  },
};
class NotifyToastContainer extends Component<Props> {
  onHide() {
    BaseActions.hideToast();
  }

  render() {
    const { toast } = this.props;

    return <NotifyToast toast={toast} onHide={this.onHide} />;
  }
}

export default connect(
  ({ base }: State) => ({
    toast: base.toast,
  }),
  () => ({}),
)(NotifyToastContainer);
