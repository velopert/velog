// @flow
import React, { Component, type Node } from 'react';

type Props<T> = {
  values: T,
  render({
    form: T,
    onSubmit(form: T): void,
    onChange(e: any): void,
  }): Node,
  onSubmit(form: T): void,
};

class FormManager extends Component<Props<*>, any> {
  static defaultProps = {
    values: {},
  };
  constructor(props: Props<*>) {
    super(props);
    this.state = props.values;
  }
  handleChange = (e: any) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.onSubmit(this.state);
    this.setState(this.props.values);
  };
  render() {
    return this.props.render({
      form: this.state,
      onSubmit: this.handleSubmit,
      onChange: this.handleChange,
    });
  }
}

export default FormManager;
