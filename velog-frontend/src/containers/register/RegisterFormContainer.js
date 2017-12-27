// @flow

import React, { Component } from 'react';
import RegisterForm from 'components/register/RegisterForm';
import { connect } from 'react-redux';
import type { State } from 'store';
import { AuthActions } from 'store/actionCreators';

type Props = {
  name: string,
  email: string,
  username: string,
  shortBio: string
};

class RegisterFormContainer extends Component<Props> {
  onChange = (e: SyntheticInputEvent<HTMLInputElement>): void => {
    const { value, name } = e.target;
    AuthActions.changeRegisterForm({
      name, value,
    });
  }

  render() {
    const { onChange } = this;
    const { name, email, username, shortBio } = this.props;

    return (
      <RegisterForm
        onChange={onChange}
        name={name}
        email={email}
        username={username}
        shortBio={shortBio}
      />
    );
  }
}

export default connect(
  ({ auth }: State) => {
    const { registerForm } = auth;
    const { name, email, username, shortBio } = registerForm;

    return {
      name, email, username, shortBio,
    };
  },
  () => ({}),
)(RegisterFormContainer);
