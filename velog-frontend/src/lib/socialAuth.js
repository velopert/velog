import hello from 'hellojs';

hello.init({
  github: '7c3902d881910d52ae3e',
}, {
  redirect_uri: 'callback',
});

window.hello = hello;