// @flow
import React, { Component } from 'react';

type Props = {
  color: string
};

class BackgroundColor extends Component<Props> {
  prevColor: ?string = null;

  setBgColor = (color: string): void => {
    if (!document.body) return;
    document.body.style.background = color;
  }

  componentDidMount() {
    const { color } = this.props;
    if (!document.body) return;
    this.prevColor = document.body.style.background;
    this.setBgColor(color);
  }

  componentWillUnmount() {
    if (!this.prevColor) return;
    this.setBgColor(this.prevColor);
  }

  render() {
    return (
      null
    );
  }
}

export default BackgroundColor;
