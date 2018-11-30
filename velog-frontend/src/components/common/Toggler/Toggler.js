// @flow

import React, { Component } from 'react';
import cx from 'classnames';
import './Toggler.scss';

type Props = {
  name?: string,
  text: string,
  value: boolean,
  onChange: (event: { name: string, value: boolean }) => void,
  className?: string,
};

type State = {
  localValue: boolean,
};

class Toggler extends Component<Props, State> {
  state = {
    localValue: false,
  };

  constructor(props: Props) {
    super(props);
    this.state.localValue = props.value;
  }

  onToggle = () => {
    this.setState({
      localValue: !this.state.localValue,
    });
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state.localValue !== prevState.localValue) {
      this.props.onChange({
        name: this.props.name || '',
        value: this.state.localValue,
      });
      return;
    }
    if (this.state.localValue !== this.props.value) {
      this.setState({
        localValue: this.props.value,
      });
    }
  }

  render() {
    const { text } = this.props;
    return (
      <div className={cx('Toggler', this.props.className)}>
        <div
          className={cx('toggle-box', { active: this.state.localValue })}
          onClick={this.onToggle}
        >
          <div className="circle" />
        </div>
        <div className="text">{text}</div>
      </div>
    );
  }
}

export default Toggler;
