// @flow
import React from 'react';
import { connect } from 'react-redux';
import type { State } from 'store';
import { SampleActions } from 'store/actionCreators';

const SampleContainer = () => {
  SampleActions.increase(10);
  return (
    <div>
      Hello
    </div>
  );
};

export default connect(
  ({ sample }: State) => ({
    value: sample.value,
  }),
  () => ({}),
)(SampleContainer);