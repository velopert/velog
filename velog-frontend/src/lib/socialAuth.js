// @flow

import hello from 'hellojs';

hello.init({
  github: '7c3902d881910d52ae3e',
  facebook: '203040656938507',
  google: '512153499356-4sg3s216vvqiv5kjfstal7dd2c1gc1an.apps.googleusercontent.com',
}, {
  redirect_uri: 'callback',
});

export const github = (): Promise<*> => hello.login('github');
export const facebook = (): Promise<*> => hello.login('facebook', { scope: 'email, public_profile' });
export const google = (): Promise<*> => hello.login('google', {
  scope: 'https://www.googleapis.com/auth/userinfo.email',
});
