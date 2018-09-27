import React, { Component } from 'react';
import queryString from 'query-string';

function isFacebookApp() {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  return ua.indexOf('FBAN') > -1 || ua.indexOf('FBAV') > -1;
}

class Callback extends Component {
  componentDidMount() {
    if (isFacebookApp()) {
      window.alert('죄송합니다. 페이스북 인앱 브라우저는 소셜로그인이 불가능합니다.');
      window.href = 'https://velog.io/';
    }
  }

  render() {
    return null;
  }
}

export default Callback;
