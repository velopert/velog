// @flow
import React, { Component } from 'react';
import './SelectBox.scss';

type Option = {
  id: string | number,
  text: string,
};

type Props = {
  options: Option[],
};

class SelectBox extends Component<Props> {
  renderOptionList() {
    return this.props.options.map(({ id, text }) => (
      <option value={id} key={id}>
        {text}
      </option>
    ));
  }

  render() {
    return (
      <div className="SelectBox">
        <select>{this.renderOptionList()}</select>
      </div>
    );
  }
}

export default SelectBox;
