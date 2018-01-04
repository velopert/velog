// @flow

import React, { Component } from 'react';
import { withRouter, type Match, type Location, type RouterHistory } from 'react-router-dom';
import RegisterForm from 'components/register/RegisterForm';
import { connect } from 'react-redux';
import type { State } from 'store';
import type { AuthResult } from 'store/modules/auth';
import { AuthActions, UserActions } from 'store/actionCreators';
import storage, { keys } from 'lib/storage';
import queryString from 'query-string';

type Props = {
  displayName: string,
  email: string,
  username: string,
  shortBio: string,
  registerToken: string,
  match: Match,
  location: Location,
  history: RouterHistory,
  authResult: AuthResult,
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

  onRegister = async () => {
    const { displayName, username, shortBio, registerToken, history } = this.props;
    try {
      await AuthActions.localRegister({
        registerToken,
        form: {
          displayName,
          username,
          shortBio,
        },
      });

      const { authResult } = this.props;

      if (!authResult) return;
      const { token, user } = authResult;

      UserActions.setUser(user);
      storage.set(keys.user, user);

      history.push('/');
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const { onChange, onRegister } = this;
    const { displayName, email, username, shortBio } = this.props;

    return (
      <RegisterForm
        onChange={onChange}
        onRegister={onRegister}
        displayName={displayName}
        email={email}
        username={username}
        shortBio={shortBio}
      />
    );
  }
}

export default connect(
  ({ auth }: State) => {
    const { registerForm, registerToken, authResult } = auth;
    const { displayName, email, username, shortBio } = registerForm;

    return {
      displayName,
      email,
      username,
      shortBio,
      registerToken,
      authResult,
    };
  },
  () => ({}),
)(withRouter(RegisterFormContainer));
