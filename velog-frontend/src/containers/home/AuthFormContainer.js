// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AuthActions } from 'store/actionCreators';
import type { State } from 'store';
import AuthForm from 'components/home/AuthForm';
import { pressedEnter } from 'lib/common';

type Props = {
  email: string,
  sentEmail: boolean,
  sending: boolean,
}

class AuthFormContainer extends Component<Props> {
  onEnterKeyPress = pressedEnter(() => {
    this.onSendVerification();
  })

  onChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const { value } = e.target;
    AuthActions.setEmailInput(value);
  }

  onSendVerification = async (): Promise<*> => {
    const { email } = this.props;
    try {
      await AuthActions.sendAuthEmail(email);
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const { onChange, onSendVerification, onEnterKeyPress } = this;
    const { email, sentEmail, sending } = this.props;

    return (
      <AuthForm
        email={email}
        sending={sending}
        sentEmail={sentEmail}
        onChange={onChange}
        onSendVerification={onSendVerification}
        onEnterKeyPress={onEnterKeyPress}
      />
    );
  }
}

export default connect(
  ({ auth, pender }: State) => ({
    email: auth.email,
    sentEmail: auth.sentEmail,
    sending: pender.pending['auth/SEND_AUTH_EMAIL'],
  }),
  () => ({}),
)(AuthFormContainer);
