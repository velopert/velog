// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter, type Match } from 'react-router-dom';

type Props = {};
class UserRecentPosts extends Component<Props> {
  render() {
    return <div>배고파요</div>;
  }
}

export default compose(connect(), withRouter)(UserRecentPosts);
