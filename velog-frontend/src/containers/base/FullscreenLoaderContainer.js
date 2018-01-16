// @flow
import React, { Component } from 'react';
import FullscreenLoader from 'components/base/FullscreenLoader';
import { connect } from 'react-redux';
import type { State } from 'store';

type Props = {
  visible: boolean,
};

class FullscreenLoaderContainer extends Component<Props> {
  render() {
    return (
      <FullscreenLoader {...this.props} />
    );
  }
}

export default connect(
  ({ base }: State) => ({
    visible: base.fullscreenLoader,
  }),
  () => ({}),
)(FullscreenLoaderContainer);
