// @flow
import React, { Component } from 'react';
import Nano from 'nanobar';
import './NanoBar.scss';

type Props = {};

class NanoBar extends Component<Props> {
  nanobar = null;
  componentDidMount() {
    this.nanobar = new Nano({
      classname: 'nanobar',
      id: 'nanobar',
    });
    window.nanobar = this.nanobar;
  }
  remove = () => {
    window.nanobar = null;
    delete this.nanobar;
  };
  render() {
    return null;
  }
}

export default NanoBar;
