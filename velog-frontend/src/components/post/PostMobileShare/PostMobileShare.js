// @flow
import React, { Component, Fragment } from 'react';
import ShareIcon from 'react-icons/lib/md/share';
import ExitIcon from 'react-icons/lib/md/close';
import FacebookIcon from 'react-icons/lib/fa/facebook-official';
import TwitterIcon from 'react-icons/lib/fa/twitter';
import LinkIcon from 'react-icons/lib/md/link';
import { shareFacebook, shareTwitter, copyText } from 'lib/share';
import cx from 'classnames';

import './PostMobileShare.scss';

type Props = {
  url: string,
  title: string,
  username: string,
  informCopy: () => void,
};
type State = {
  open: boolean,
  animating: boolean,
};

class PostMobileShare extends Component<Props, State> {
  animateTimeoutId = null;

  state = {
    open: false,
    animating: false,
  };

  onToggle = () => {
    this.setState({
      open: !this.state.open,
      animating: true,
    });
    if (this.animateTimeoutId) {
      clearTimeout(this.animateTimeoutId);
    }
    setTimeout(() => {
      this.setState({
        animating: false,
      });
    }, 150);
  };

  onFacebookShare = () => {
    this.onToggle();
    shareFacebook(`https://velog.io${this.props.url}`);
  };

  onTwitterShare = () => {
    this.onToggle();
    shareTwitter(
      `https://velog.io${this.props.url}`,
      `${this.props.username}님이 작성하신 "${this.props.title}" 포스트를 읽어보세요.`,
    );
  };

  onCopy = () => {
    this.onToggle();
    copyText(`http://velog.io${this.props.url}`);
    this.props.informCopy();
  };

  componentWillUnmount() {
    if (this.animateTimeoutId) {
      clearTimeout(this.animateTimeoutId);
    }
  }

  render() {
    const { open, animating } = this.state;

    const transition = (() => {
      if (!animating) return '';
      if (open) return 'appear';
      return 'disappear';
    })();

    return (
      <div className="PostMobileShare">
        {(open || animating) && (
          <div className={cx('buttons', transition)}>
            <button onClick={this.onFacebookShare}>
              <FacebookIcon />
            </button>
            <button onClick={this.onTwitterShare}>
              <TwitterIcon />
            </button>
            <button onClick={this.onCopy}>
              <LinkIcon />
            </button>
          </div>
        )}
        <button className={cx({ open: this.state.open })} onClick={this.onToggle}>
          {this.state.open ? <ExitIcon /> : <ShareIcon />}
        </button>
      </div>
    );
  }
}

export default PostMobileShare;
