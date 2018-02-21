// @flow
import React, { Component, type Node } from 'react';
import cx from 'classnames';

import './ModalWrapper.scss';

type Props = {
  children: Node,
  className: ?string
}

class ModalWrapper extends Component<Props> {
  render() {
    const { children, className } = this.props;

    return (
      <div className="ModalWrapper">
        <div className="dimmer" />
        <div className="center">
          <div className="modal-positioner">
            <div className={cx('modal-content', className)}>
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ModalWrapper;