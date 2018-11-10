// @flow
import React, { Component } from 'react';
import { getScrollTop } from 'lib/common';
import cx from 'classnames';
import './PostLeftSticker.scss';

type Props = {};
type State = {
  fixed: boolean,
};

class PostLeftSticker extends Component<Props, State> {
  pos: number = 0;
  element = React.createRef();
  state = {
    fixed: false,
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
  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }
  render() {
    const { fixed } = this.state;
    return (
      <div className="PostLeftSticker" ref={this.element}>
        <div className={cx('wrapper', { fixed })}>Hello World</div>
      </div>
    );
  }
}

export default PostLeftSticker;
