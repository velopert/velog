import React from 'react';
import ReactDOM from 'react-dom';
import Root from './Root';
import './styles/main.scss';
// import registerServiceWorker from './registerServiceWorker';

const render = window.__REDUX_STATE__ ? ReactDOM.hydrate : ReactDOM.render;

render(<Root />, document.getElementById('root'));
// registerServiceWorker();

// load facebook
/* eslint-disable */
window.fbAsyncInit = function() {
  FB.init({
    appId: '203040656938507',
    autoLogAppEvents: true,
    xfbml: true,
    version: 'v3.2',
  });
};

(function(d, s, id) {
  let js,
    fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);
  js.id = id;
  js.src = 'https://connect.facebook.net/en_US/sdk.js';
  fjs.parentNode.insertBefore(js, fjs);
})(document, 'script', 'facebook-jssdk');
/* eslint-enable */
