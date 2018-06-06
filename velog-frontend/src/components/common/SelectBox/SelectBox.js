// @flow
import React, { Component } from 'react';
import cx from 'classnames';
import UnfoldIcon from 'react-icons/lib/md/unfold-more';
import './SelectBox.scss';

type Option = {
  id: string | number,
  text: string,
};

type Props = {
  options: Option[],
  className?: string,
};

class SelectBox extends Component<Props> {
  static defaultProps = {
    className: '',
  };

  renderOptionList() {
    return this.props.options.map(({ id, text }) => (
      <option value={id} key={id}>
        {text}
      </option>
    ));
  }

  render() {
    const { className, ...rest } = this.props;
    return (
      <div className={cx('SelectBox', className)}>
        <select {...rest}>{this.renderOptionList()}</select>
        <UnfoldIcon />
      </div>
    );
  }
}

export default SelectBox;
