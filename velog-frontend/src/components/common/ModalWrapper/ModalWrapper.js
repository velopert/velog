// @flow
import React, { Component, type Node } from 'react';
import cx from 'classnames';

import './ModalWrapper.scss';
import HideScrollbar from '../HideScrollbar';

type Props = {
  children: Node,
  className?: string,
  open: boolean,
};

type State = {
  animate: boolean,
};

class ModalWrapper extends Component<Props, State> {
  animateId: any = null;

  state = {
    animate: false,
  };

  animate(): void {
    this.setState({ animate: true });
    this.animateId = setTimeout(() => {
      this.setState({
        animate: false,
      });
    }, 150);
  }

  componentDidMount() {}

  componentDidUpdate(prevProps: Props) {
    if (prevProps.open !== this.props.open) {
      this.animate();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.animateId);
  }

  render() {
    const { children, className, open } = this.props;
    const { animate } = this.state;

    if (!open && !animate) return null;

    return (
      <div className="ModalWrapper">
        <HideScrollbar />
        <div className="dimmer" />
        <div className="center">
          <div className="modal-positioner">
            <div
              className={cx('modal-content', className, {
                appear: open,
                disappear: animate && !open,
              })}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ModalWrapper;
