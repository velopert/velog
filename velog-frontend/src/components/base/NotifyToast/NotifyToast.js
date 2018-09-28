// @flow
import React, { Component } from 'react';
import cx from 'classnames';
import './NotifyToast.scss';

type Props = {
  toast: {
    type: ?string,
    message: ?string,
    visible: boolean,
  },
  onHide: () => void,
};

type State = {
  animating: boolean,
};

class NotifyToast extends Component<Props, State> {
  state = {
    animating: false,
  };
  autoHideTimeout = null;
  animateTimeout = null;
  componentDidUpdate(prevProps: Props, prevState: State) {
    // false -> true
    if (!prevProps.toast.visible && this.props.toast.visible) {
      if (this.autoHideTimeout) {
        clearTimeout(this.autoHideTimeout);
        this.autoHideTimeout = null;
      }
      this.autoHideTimeout = setTimeout(() => {
        this.props.onHide();
        this.autoHideTimeout = null;
      }, 1500);
    }

    if (prevProps.toast.visible !== this.props.toast.visible) {
      this.setState({
        animating: true,
      });
      if (this.animateTimeout) {
        clearTimeout(this.animateTimeout);
        this.animateTimeout = null;
      }
      this.animateTimeout = setTimeout(() => {
        this.setState({
          animating: false,
        });
      }, 150);
    }
  }
  render() {
    const { type, message, visible } = this.props.toast;
    const { animating } = this.state;
    const transition = (() => {
      if (!animating) return '';
      return visible ? 'appear' : 'disappear';
    })();
    if (!animating && !visible) return null;
    if (!type || !message) return null;
    return <div className={cx('NotifyToast', type, transition)}>{message}</div>;
  }
}

export default NotifyToast;
