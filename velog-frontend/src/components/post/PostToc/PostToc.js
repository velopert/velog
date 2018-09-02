// @flow
import React, { Component } from 'react';
import type { TocItem } from 'store/modules/posts';
import cx from 'classnames';
import throttle from 'lodash/throttle';
import { getScrollTop } from 'lib/common';
import './PostToc.scss';

type Props = {
  toc: ?(TocItem[]),
  activeHeading: ?string,
  onActivateHeading: (headingId: string) => void,
};

type State = {
  fixed: boolean,
};

class PostToc extends Component<Props, State> {
  element: ?HTMLElement;
  pos: number = 0;

  state = {
    fixed: false,
  };

  setPos = () => {
    const scrollTop = getScrollTop();
    if (!this.element) return;
    this.pos = scrollTop + this.element.getBoundingClientRect().top;
  };

  setFixed = (fixed: boolean) => {
    if (this.state.fixed === fixed) return;
    this.setState({
      fixed,
    });
  };

  componentDidMount() {
    this.registerEvent();
    if (!this.props.toc) return;
    this.setPos();
  }

  componentWillUnmount() {
    this.unregisterEvent();
  }

  onScroll = () => {
    const scrollTop = getScrollTop();
    this.setFixed(scrollTop > this.pos);
  };

  registerEvent = () => {
    window.addEventListener('scroll', this.onScroll);
  };

  unregisterEvent = () => {
    window.removeEventListener('scroll', this.onScroll);
  };

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.toc && this.props.toc) {
      this.setPos();
    }
  }

  render() {
    const { toc, activeHeading } = this.props;
    const { fixed } = this.state;
    if (!toc) return null;
    return (
      <div
        className="PostToc"
        ref={(ref) => {
          if (!ref) return;
          this.element = ref;
        }}
      >
        <div className={cx('wrapper', { fixed })}>
          <ul>
            {toc.map(({ anchor, level, text }) => (
              <li
                style={{
                  paddingLeft: `${(level === 1 ? 0 : level - 2) * 0.5}rem`,
                }}
                className={cx({
                  active: activeHeading === anchor,
                })}
                key={anchor}
              >
                <a onClick={() => this.props.onActivateHeading(anchor)} href={`#${anchor}`}>
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default PostToc;
