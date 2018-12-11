// @flow
import React, { Component } from 'react';
import cx from 'classnames';
import SearchIcon from 'react-icons/lib/md/search';
import './MainSearchBox.scss';

type Props = {
  onSearch: (keyword: string) => void,
};

type State = {
  value: string,
  focus: boolean,
};

class MainSearchBox extends Component<Props, State> {
  input = React.createRef();
  state = {
    value: '',
    focus: false,
  };

  onIconClick = () => {
    const input = this.input.current;
    if (!input) return;
    if (this.state.value === '') {
      input.focus();
      return;
    }
    console.log(this.state.value);
  };

  onFocus = () => {
    this.setState({
      focus: true,
    });
  };

  onBlur = () => {
    this.setState({
      focus: false,
    });
  };

  onChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({
      value: e.target.value,
    });
  };

  onKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      this.props.onSearch(this.state.value);
    }
  };

  render() {
    return (
      <div className={cx('MainSearchBox', { focus: this.state.focus })}>
        <div className="gray-rect">
          <SearchIcon onClick={this.onIconClick} />
          <input
            value={this.state.value}
            ref={this.input}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onChange={this.onChange}
            onKeyPress={this.onKeyPress}
          />
        </div>
      </div>
    );
  }
}

export default MainSearchBox;
