// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AuthActions } from 'store/actionCreators';
import type { State } from 'store';
import AuthForm from 'components/home/AuthForm';

type Props = {
  email: string
}

class AuthFormContainer extends Component<Props> {
  onChange = (e) => {
    const { value } = e.target;
    AuthActions.setEmailInput(value);
  }

  render() {
    const { onChange } = this;
    const { email } = this.props;

    return (
      <AuthForm
        email={email}
        onChange={onChange}
      />
    );
  }
}

export default connect(
  (state: State) => ({
    email: state.auth.email,
  }),
  () => ({}),
)(AuthFormContainer);
