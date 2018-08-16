// @flow
import React, { Fragment, Component, type Node } from 'react';
import LeftIcon from 'react-icons/lib/md/keyboard-arrow-left';
import RightIcon from 'react-icons/lib/md/keyboard-arrow-right';

import './WritePanes.scss';

type Props = {
  left: Node,
  right: Node,
  mode: string,
  onSetLayoutMode(mode: string): void,
};

type State = {
  ratio: number,
  hideLeft: boolean,
  hideRight: boolean,
};

class WritePanes extends Component<Props, State> {
  state = {
    ratio: 0.5,
    hideLeft: false,
    hideRight: false,
  };

  onMouseMove = (e: any) => {
    const ratio = e.clientX / window.innerWidth;
    const right = window.innerWidth - e.clientX;

    const half = ratio > 0.49 && ratio < 0.51;

    this.setState({
      ratio: half ? 0.5 : ratio,
    });

    if (e.clientX < 150) {
      this.props.onSetLayoutMode('preview');
      this.setState({
        hideLeft: true,
      });
      this.onMouseUp();
    }

    if (right < 150) {
      this.props.onSetLayoutMode('editor');
      this.setState({
        hideRight: true,
      });
      this.onMouseUp();
    }
  };

  onMouseUp = (e: any) => {
    if (!document || !document.body) return;
    document.body.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  };

  onSeparatorMouseDown = (e: any) => {
    if (!document || !document.body) return;
    document.body.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  };

  onUnhideLeft = () => {
    this.props.onSetLayoutMode('both');
    this.setState({
      hideLeft: false,
      ratio: 150 / window.innerWidth,
    });
  };

  onUnhideRight = () => {
    this.props.onSetLayoutMode('both');
    this.setState({
      hideRight: false,
      ratio: (window.innerWidth - 150) / window.innerWidth,
    });
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.props.mode !== prevProps.mode) {
      switch (this.props.mode) {
        case 'editor':
          this.setState({
            hideLeft: false,
            hideRight: true,
          });
          break;
        case 'preview':
          this.setState({
            hideRight: false,
            hideLeft: true,
          });
          break;
        case 'both':
          this.setState({
            hideLeft: false,
            hideRight: false,
            ratio: 0.5,
          });
          break;
        default:
      }
    }
  }

  render() {
    const { left, right } = this.props;
    const { ratio, hideLeft, hideRight } = this.state;

    const leftStyle = {
      flex: hideRight ? 1 : ratio,
    };

    const rightStyle = {
      flex: hideLeft ? 1 : 1 - ratio,
    };

    const separatorStyle = {
      left: `${ratio * 100}%`,
    };

    return (
      <Fragment>
        {hideLeft && (
          <div className="reveal" onClick={this.onUnhideLeft}>
            <RightIcon />
          </div>
        )}
        {!hideLeft && (
          <div className="pane left" style={leftStyle}>
            {left}
            {!(hideLeft || hideRight) && (
              <div className="separator" onMouseDown={this.onSeparatorMouseDown} />
            )}
          </div>
        )}
        {!hideRight && (
          <div className="pane right" style={rightStyle}>
            {right}
          </div>
        )}
        {hideRight && (
          <div className="reveal right" onClick={this.onUnhideRight}>
            <LeftIcon />
          </div>
        )}
      </Fragment>
    );
  }
}

export default WritePanes;
