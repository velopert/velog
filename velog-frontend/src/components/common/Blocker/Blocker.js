// @flow
import React, { Component } from 'react';

type Props = {};

class Blocker extends Component<Props> {
  componentDidMount() {
    if (!window) return;
    window.onbeforeunload = () => true;
  }

  componentWillUnmount() {
    if (!window) return;
    window.onbeforeunload = null;
  }

  render() {
    return null;
  }
}

export default Blocker;
