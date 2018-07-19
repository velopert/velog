// @flow
import React, { Component } from 'react';

type Props = {};

class HideScrollbar extends Component<Props> {
  componentDidMount() {
    if (!document.body) return;
    document.body.style.overflowY = 'hidden';
  }

  componentWillUnmount() {
    if (!document.body) return;
    document.body.style.overflowY = 'auto';
  }

  render() {
    return null;
  }
}

export default HideScrollbar;
