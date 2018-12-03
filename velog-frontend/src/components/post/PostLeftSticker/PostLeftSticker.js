// @flow
import React, { Component, Fragment } from 'react';
import { getScrollTop } from 'lib/common';
import ShareIcon from 'react-icons/lib/md/share';
import HeartOutlineIcon from 'react-icons/lib/fa/heart-o';
import HeartIcon from 'react-icons/lib/fa/heart';
import FacebookIcon from 'react-icons/lib/fa/facebook-official';
import TwitterIcon from 'react-icons/lib/fa/twitter';
import ExitIcon from 'react-icons/lib/md/close';
import Tooltip from 'react-tooltip';
import withClickOutside from 'react-onclickoutside';
import LinkIcon from 'react-icons/lib/md/link';

import cx from 'classnames';
import './PostLeftSticker.scss';
import { shareFacebook, shareTwitter, copyText } from '../../../lib/share';

type Props = {
  likes: number,
  liked: boolean,
  onToggleLike: () => void,
  informCopy: () => void,
  logged: boolean,
  url: string,
  title: string,
  username: string,
};

type State = {
  fixed: boolean,
  openShare: boolean,
  justLiked: boolean,
};

class PostLeftSticker extends Component<Props, State> {
  pos: number = 0;
  element = React.createRef();
  state = {
    fixed: false,
    openShare: false,
    justLiked: false,
  };
  handleClickOutside = () => {
    if (!this.state.openShare) return;
    this.onToggleShareButton();
  };
  componentDidMount() {
    if (!this.element.current) return;
    this.pos = this.element.current.getBoundingClientRect().top + getScrollTop();
    window.addEventListener('scroll', this.onScroll);
  }
  onScroll = () => {
    const scrollTop = getScrollTop();
    const fixed = scrollTop >= this.pos;
    if (this.state.fixed !== fixed) {
      this.setState({ fixed });
    }
  };
  onToggleShareButton = () => {
    this.setState({
      openShare: !this.state.openShare,
    });
  };
  onFacebookShare = () => {
    this.onToggleShareButton();
    shareFacebook(`https://velog.io${this.props.url}`);
  };
  onTwitterShare = () => {
    this.onToggleShareButton();
    shareTwitter(
      `https://velog.io${this.props.url}`,
      `${this.props.username}님이 작성하신 "${this.props.title}" 포스트를 읽어보세요.`,
    );
  };
  onCopy = () => {
    this.onToggleShareButton();
    copyText(`https://velog.io${this.props.url}`);
    this.props.informCopy();
  };
  componentDidUpdate(prevProps: Props) {
    if (!prevProps.liked && this.props.liked) {
      this.setState({
        justLiked: true,
      });
    }
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }
  render() {
    const { likes, liked, logged, onToggleLike } = this.props;
    const { fixed, openShare, justLiked } = this.state;
    return (
      <div className="PostLeftSticker" ref={this.element}>
        <div className={cx('wrapper', { fixed })}>
          <button
            onClick={onToggleLike}
            className={cx('circle like', { liked, justLiked: liked && justLiked })}
            {...(logged
              ? {}
              : {
                  'data-tip': '로그인 후 이용해주세요.',
                })}
          >
            {liked ? <HeartIcon /> : <HeartOutlineIcon />}
          </button>
          <div className="likes-count">{likes}</div>
          <button className="circle share" onClick={this.onToggleShareButton}>
            {openShare ? <ExitIcon /> : <ShareIcon />}
          </button>
          {openShare && (
            <Fragment>
              <button className="circle share" onClick={this.onFacebookShare}>
                <FacebookIcon />
              </button>
              <button className="circle share" onClick={this.onTwitterShare}>
                <TwitterIcon />
              </button>
              <button className="circle share" onClick={this.onCopy}>
                <LinkIcon />
              </button>
            </Fragment>
          )}
        </div>
        <Tooltip effect="solid" className="tooltip" />
      </div>
    );
  }
}

export default withClickOutside(PostLeftSticker);
