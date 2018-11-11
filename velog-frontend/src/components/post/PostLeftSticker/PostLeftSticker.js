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

import cx from 'classnames';
import './PostLeftSticker.scss';

type Props = {
  likes: number,
  liked: boolean,
  onToggleLike: () => void,
  logged: boolean,
};
type State = {
  fixed: boolean,
  openShare: boolean,
};

class PostLeftSticker extends Component<Props, State> {
  pos: number = 0;
  element = React.createRef();
  state = {
    fixed: false,
    openShare: false,
  };
  componentDidMount() {
    if (!this.element.current) return;
    this.pos = this.element.current.getBoundingClientRect().top;
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
  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }
  render() {
    const { likes, liked, logged, onToggleLike } = this.props;
    const { fixed, openShare } = this.state;
    return (
      <div className="PostLeftSticker" ref={this.element}>
        <div className={cx('wrapper', { fixed })}>
          <button
            onClick={onToggleLike}
            className={cx('circle like', { liked })}
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
              <button className="circle share">
                <FacebookIcon />
              </button>
              <button className="circle share">
                <TwitterIcon />
              </button>
            </Fragment>
          )}
        </div>
        <Tooltip effect="solid" className="tooltip" />
      </div>
    );
  }
}

export default PostLeftSticker;
