// @flow
import React, { Component } from 'react';
import queryString from 'query-string';
import { type ContextRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { type State } from 'store';
import { type VerifySocialResult, type AuthResult } from 'store/modules/auth';
import storage, { keys } from 'lib/storage';
import { AuthActions, UserActions, BaseActions } from '../../store/actionCreators';
import BadRequest from '../../pages/errors/BadRequest';

function isFacebookApp() {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  return ua.indexOf('FBAN') > -1 || ua.indexOf('FBAV') > -1;
}

type Props = {
  tokenData: {
    type: ?string,
    token: ?string,
  },
  verifySocialResult: VerifySocialResult,
  authResult: AuthResult,
} & ContextRouter;

type CallbackState = {
  badRequest: boolean,
};

class Callback extends Component<Props, CallbackState> {
  state = {
    badRequest: false,
  };

  initialize = async () => {
    const query = queryString.parse(this.props.location.search);
    const { type, key, next } = query;
    if (!type || !key) {
      // error
      this.setState({
        badRequest: true,
      });
      return;
    }
    try {
      await AuthActions.getProviderToken({
        type,
        key,
      });

      // register logic
      const { token } = this.props.tokenData;
      if (!token) return;
      const socialPayload = {
        accessToken: token,
        provider: type,
      };
      await AuthActions.verifySocial(socialPayload);
      if (!this.props.verifySocialResult) {
        throw new Error();
      }

      // login if account already exists
      if (this.props.verifySocialResult.exists) {
        await AuthActions.socialVelogLogin(socialPayload);
        BaseActions.exitLanding();
        const { authResult } = this.props;
        if (!authResult) return;
        const { user } = authResult;
        UserActions.setUser(user);
        storage.set(keys.user, user);
        this.props.history.push(next || '/trending');
        return;
      }

      const { email, name } = this.props.verifySocialResult;
      AuthActions.autoCompleteRegisterForm({ email: email || '', name: name || '' });
      this.props.history.push('/register');
    } catch (e) {
      this.setState({
        badRequest: true,
      });
    }
  };
  componentDidMount() {
    this.initialize();
  }

  render() {
    if (this.state.badRequest) {
      return <BadRequest />;
    }
    return null;
  }
}

export default connect(
  ({ auth }: State) => ({
    tokenData: auth.tokenData,
    verifySocialResult: auth.verifySocialResult,
    authResult: auth.authResult,
  }),
  () => ({}),
)(Callback);
