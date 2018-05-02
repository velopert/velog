import React from 'react';
import DisablePanes from 'components/write/DisablePanes/DisablePanes';
import { connect } from 'react-redux';
import type { State } from 'store';

const DisablePanesContainer = ({ visible }) => {
  return <DisablePanes visible={visible} />;
};

export default connect(
  ({ write }: State) => ({
    visible: write.writeExtra.visible,
  }),
  () => ({}),
)(DisablePanesContainer);
