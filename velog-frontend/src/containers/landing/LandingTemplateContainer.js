// @flow
import React from 'react';
import LandingTemplate from 'components/landing/LandingTemplate';
import withUser from 'lib/hoc/withUser';
import { compose } from 'redux';
import type { State } from 'store';
import { connect } from 'react-redux';

const LandingTemplateContainer = (props) => {
  if (/* props.user || */ props.hidden) return null;

  return <LandingTemplate {...props} />;
};

export default compose(
  withUser,
  connect(
    ({ base }: State) => ({
      hidden: !base.landing,
    }),
    () => ({}),
  ),
)(LandingTemplateContainer);
