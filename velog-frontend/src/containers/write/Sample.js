// @flow
import React, { Component } from 'react';
import FormManager from './FormManager';

type Props = {};
class Sample extends Component<Props> {
  handleSubmit = (form: any) => {
    console.log(form);
  };
  render() {
    return (
      <FormManager
        values={{ name: '', phone: '' }}
        onSubmit={this.handleSubmit}
        render={({ onSubmit, onChange, form }) => <div />}
      />
    );
  }
}

export default Sample;
