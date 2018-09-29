// @flow
import React, { Component, type Node } from 'react';
import { withRouter, type ContextRouter } from 'react-router-dom';

type Props = {
  children: Node,
  to: string,
  [key: string]: any,
};

class FakeLink extends Component<Props> {
  onClick = () => {
    const { history, to } = this.props;
    history.push(to);
    if (this.props.onClick) {
      this.props.onClick();
    }
  };
  render() {
    const { children, to, history, location, match, staticContext, ...rest } = this.props;
    return (
      <div {...rest} onClick={this.onClick}>
        {children}
      </div>
    );
  }
}

export default withRouter(FakeLink);
