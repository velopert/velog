// @flow
import React, { Component, type Node } from 'react';
import './Postpone.scss';

type Props = {
  duration?: number,
  children: Node,
};

type State = {
  visible: boolean,
};

class Postpone extends Component<Props, State> {
  timeoutId = null;
  static defaultProps = {
    duration: 200,
  };

  state = {
    visible: false,
  };

  componentDidMount() {
    const { duration } = this.props;
    this.timeoutId = setTimeout(() => {
      this.setState({
        visible: true,
      });
    }, duration);
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  render() {
    if (!this.state.visible) return null;
    return this.props.children;
  }
}

export default Postpone;
