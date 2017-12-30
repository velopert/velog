// @flow

import React, { Component } from 'react';
import { withRouter, type Match, type Location } from 'react-router-dom';
import RegisterForm from 'components/register/RegisterForm';
import { connect } from 'react-redux';
import type { State } from 'store';
import { AuthActions } from 'store/actionCreators';
import queryString from 'query-string';

type Props = {
  name: string,
  email: string,
  username: string,
  shortBio: string,
  match: Match,
  location: Location
};

class RegisterFormContainer extends Component<Props> {
  initialize = async () => {
    const { search } = this.props.location;
    const { code } = queryString.parse(search);

    if (!code) {
      // TODO: ERROR WHEN NO CODE
    }

    try {
      await AuthActions.getCode(code);
    } catch (e) {
      // TODO: INITIALIZE ERROR
    }
  }

  componentDidMount() {
    this.initialize();
  }

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
)(withRouter(RegisterFormContainer));
