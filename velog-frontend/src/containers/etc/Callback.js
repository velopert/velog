// @flow
import React, { Component } from 'react';
import queryString from 'query-string';
import { type ContextRouter } from 'react-router-dom';
import { AuthActions } from '../../store/actionCreators';

function isFacebookApp() {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  return ua.indexOf('FBAN') > -1 || ua.indexOf('FBAV') > -1;
}

type Props = {} & ContextRouter;

class Callback extends Component<Props> {
  initialize = async () => {
    const query = queryString.parse(this.props.location.search);
    const { type, key } = query;
    if (!type || !key) {
      // error
      return;
    }
    await AuthActions.getProviderToken({
      type,
      key,
    });
  };
  componentDidMount() {
    if (isFacebookApp()) {
      window.alert('죄송합니다. 페이스북 인앱 브라우저는 소셜로그인이 불가능합니다.');
      window.href = 'https://velog.io/';
    }
    this.initialize();
  }

  render() {
    return null;
  }
}

export default Callback;
