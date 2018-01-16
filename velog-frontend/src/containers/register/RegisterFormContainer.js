// @flow

import React, { Component } from 'react';
import { withRouter, type Match, type Location, type RouterHistory } from 'react-router-dom';
import RegisterForm from 'components/register/RegisterForm';
import { connect } from 'react-redux';
import type { State } from 'store';
import type { AuthResult, SocialAuthResult } from 'store/modules/auth';
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
  isSocial: boolean,
  socialAuthResult: SocialAuthResult,
  socialEmail: ?string
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
    const {
      displayName,
      username,
      shortBio,
      registerToken,
      history,
      isSocial,
      socialAuthResult,
    } = this.props;

    const form = {
      displayName,
      username,
      shortBio,
    };

    try {
      if (isSocial) {
        if (!socialAuthResult) return;
        const { accessToken, provider } = socialAuthResult;
        // TODO: if no email, use fallback email
        await AuthActions.socialRegister({ accessToken, provider, form });
      } else {
        await AuthActions.localRegister({
          registerToken,
          form,
        });
      }

      const { authResult } = this.props;

      if (!authResult) return;
      const { user } = authResult;

      UserActions.setUser(user);
      storage.set(keys.user, user);

      history.push('/');
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const { onChange, onRegister } = this;
    const { displayName, email, username, shortBio, socialEmail, isSocial } = this.props;

    return (
      <RegisterForm
        onChange={onChange}
        onRegister={onRegister}
        displayName={displayName}
        email={email}
        username={username}
        shortBio={shortBio}
        emailEditable={isSocial && !socialEmail}
      />
    );
  }
}

export default connect(
  ({ auth }: State) => {
    const {
      registerForm,
      registerToken,
      authResult,
      socialAuthResult,
      isSocial,
      verifySocialResult,
    } = auth;
    const { displayName, email, username, shortBio } = registerForm;

    return {
      displayName,
      email,
      username,
      shortBio,
      registerToken,
      authResult,
      socialAuthResult,
      isSocial,
      socialEmail: verifySocialResult && verifySocialResult.email,
    };
  },
  () => ({}),
)(withRouter(RegisterFormContainer));
