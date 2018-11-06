// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, type RouterHistory } from 'react-router-dom';
import { AuthActions, UserActions, BaseActions } from 'store/actionCreators';
import type { State } from 'store';
import AuthForm from 'components/landing/AuthForm';
import { pressedEnter } from 'lib/common';
import type { SocialAuthResult, VerifySocialResult, AuthResult } from 'store/modules/auth';
import storage, { keys } from 'lib/storage';

type Props = {
  email: string,
  sentEmail: boolean,
  sending: boolean,
  isUser: boolean,
  socialAuthResult: SocialAuthResult,
  verifySocialResult: VerifySocialResult,
  authResult: AuthResult,
  history: RouterHistory,
  nextUrl: ?string,
};

class AuthFormContainer extends Component<Props> {
  githubLogin: any = null;

  onEnterKeyPress = pressedEnter(() => {
    this.onSendVerification();
  });

  onChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const { value } = e.target;
    AuthActions.setEmailInput(value);
  };

  onSendVerification = async (): Promise<*> => {
    const { email } = this.props;
    try {
      await AuthActions.sendAuthEmail(email);
    } catch (e) {
      console.log(e);
    }
  };

  onSocialLogin = async (provider: string) => {
    // TODO: refactoring
    const nextUrl = this.props.nextUrl || '/trending';
    if (provider === 'github') {
      const redirectUri = `${process.env.API_HOST || ''}/auth/callback/github?next=${nextUrl}`;
      window.location.replace(
        `https://github.com/login/oauth/authorize?scope=user:email&client_id=${process.env
          .GITHUB_ID || ''}&redirect_uri=${redirectUri}`,
      );
      return;
    }
    if (provider === 'google') {
      const googleLoginUrl = `${process.env.API_HOST ||
        ''}/auth/callback/google/login?next=${nextUrl}`;
      window.location.replace(googleLoginUrl);
      return;
    }
    if (provider === 'facebook') {
      const facebookLogin = `${process.env.API_HOST ||
        ''}/auth/callback/facebook/login?next=${nextUrl}`;
      window.location.replace(facebookLogin);
    }
  };

  onExitLanding = () => {
    BaseActions.exitLanding();
  };

  render() {
    const { onChange, onSendVerification, onEnterKeyPress, onSocialLogin, onExitLanding } = this;
    const { email, sentEmail, sending, isUser } = this.props;

    return (
      <AuthForm
        isUser={isUser}
        email={email}
        sending={sending}
        sentEmail={sentEmail}
        onChange={onChange}
        onSendVerification={onSendVerification}
        onEnterKeyPress={onEnterKeyPress}
        onSocialLogin={onSocialLogin}
        onExitLanding={onExitLanding}
      />
    );
  }
}

export default connect(
  ({ auth, pender }: State) => ({
    email: auth.email,
    sentEmail: auth.sentEmail,
    isUser: auth.isUser,
    sending: pender.pending['auth/SEND_AUTH_EMAIL'],
    socialAuthResult: auth.socialAuthResult,
    verifySocialResult: auth.verifySocialResult,
    authResult: auth.authResult,
    nextUrl: auth.nextUrl,
  }),
  () => ({}),
)(withRouter(AuthFormContainer));
