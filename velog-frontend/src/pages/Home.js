// @flow
import React, { Component } from 'react';
import PageTemplate from 'components/base/PageTemplate';
import LandingTemplateContainer from 'containers/landing/LandingTemplateContainer';
import HeaderContainer from 'containers/base/HeaderContainer';
import AuthFormContainer from 'containers/landing/AuthFormContainer';
import Main from 'containers/main/Main';
import { type ContextRouter } from 'react-router-dom';
import { actionCreators as baseActions } from 'store/modules/base';
import { actionCreators as authActions } from 'store/modules/auth';
import { bindActionCreators, type Dispatch } from 'redux';
import { connect } from 'react-redux';
import queryString from 'query-string';

type Props = {
  BaseActions: typeof baseActions,
  AuthActions: typeof authActions,
} & ContextRouter;

class Home extends Component<Props> {
  constructor(props: Props) {
    super(props);
    const { BaseActions, AuthActions } = this.props;
    if (this.props.match.params.mode) {
      BaseActions.exitLanding();
    }
    const query = queryString.parse(this.props.location.search);
    if (query.next) {
      BaseActions.enterLanding();
      AuthActions.setNextUrl(query.next);
    }
  }

  render() {
    return (
      <PageTemplate>
        <LandingTemplateContainer form={<AuthFormContainer />} />
        <Main />
      </PageTemplate>
    );
  }
}

export default connect(
  state => ({}),
  (dispatch: Dispatch<*>) => ({
    BaseActions: bindActionCreators(baseActions, dispatch),
    AuthActions: bindActionCreators(authActions, dispatch),
  }),
)(Home);
