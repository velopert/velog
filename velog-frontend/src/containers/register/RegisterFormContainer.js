// @flow

import React, { Component } from 'react';
import { withRouter, type Match, type Location, type RouterHistory } from 'react-router-dom';
import RegisterForm from 'components/register/RegisterForm';
import { connect } from 'react-redux';
import type { State } from 'store';
import type { AuthResult, SocialAuthResult } from 'store/modules/auth';
import { AuthActions, UserActions, BaseActions } from 'store/actionCreators';
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
  socialEmail: ?string,
  error: ?{
    name: string,
    payload: any,
  },
  nextUrl: string,
};

class RegisterFormContainer extends Component<Props> {
  initialize = async () => {
    const { isSocial, history } = this.props;
    const { search } = this.props.location;
    const { code } = queryString.parse(search);

    if (!code && !isSocial) {
      history.push('/');
      return;
    }

    try {
      if (!isSocial) {
        await AuthActions.getCode(code);
      }
    } catch (e) {
      // TODO: INITIALIZE ERROR
    }
  };

  componentDidMount() {
    this.initialize();
  }

  onChange = (e: SyntheticInputEvent<HTMLInputElement>): void => {
    const { value, name } = e.target;
    AuthActions.changeRegisterForm({
      name,
      value,
    });
  };

  onRegister = async () => {
    const {
      displayName,
      username,
      shortBio,
      registerToken,
      history,
      isSocial,
      socialAuthResult,
      email,
    } = this.props;

    const form = {
      ...(isSocial ? { fallbackEmail: email } : {}),
      displayName,
      username,
      shortBio,
    };

    if (!/^[a-z0-9-_]{3,16}$/.test(username)) {
      AuthActions.setError({ name: 'FIELD_RULE', payload: 'username' });
      return;
    }

    if (shortBio.length > 140) {
      AuthActions.setError({ name: 'FIELD_RULE', payload: 'shortBio' });
      return;
    }

    if (displayName.length < 1 || displayName.length > 40) {
      AuthActions.setError({ name: 'FIELD_RULE', payload: 'displayName' });
      return;
    }

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
      BaseActions.exitLanding();
      history.push(this.props.nextUrl || '/');
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const { onChange, onRegister } = this;
    const { displayName, email, username, shortBio, socialEmail, isSocial, error } = this.props;

    return (
      <RegisterForm
        onChange={onChange}
        onRegister={onRegister}
        displayName={displayName}
        email={email}
        username={username}
        shortBio={shortBio}
        emailEditable={isSocial && !socialEmail}
        error={error}
        hideEmail={isSocial && !email}
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
      error,
      nextUrl,
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
      error,
      nextUrl,
    };
  },
  () => ({}),
)(withRouter(RegisterFormContainer));
