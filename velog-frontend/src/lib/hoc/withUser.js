// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

const withUser = (View: any) => {
  const WithUser = props => (
    <View {...props} />
  );

  return connect(
    ({ user }) => ({
      user: user.user,
    }),
    () => ({}),
  )(WithUser);
};

export default withUser;
