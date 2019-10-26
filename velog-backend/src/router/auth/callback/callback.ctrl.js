// @flow
import type { Middleware } from 'koa';
import axios from 'axios';
import crypto from 'crypto';
import redisClient from 'lib/redisClient';
import { google } from 'googleapis';
import qs from 'qs';

const baseUrl =
  process.env.NODE_ENV === 'development'
    ? 'https://localhost:3000/'
    : 'https://velog.io/';

// https://github.com/login/oauth/authorize?scope=user:email&client_id=f51c5f7d1098d4a1cbdf
// memo: http://localhost:4000/auth/callback/github?next=https://velog.io/&code=906e127c5d573424a53e
export const githubCallback: Middleware = async (ctx) => {
  try {
    const { GITHUB_ID, GITHUB_SECRET } = process.env;
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: GITHUB_ID,
        client_secret: GITHUB_SECRET,
        code: ctx.query.code,
      },
      {
        headers: {
          accept: 'application/json',
        },
      },
    );
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    const hash = crypto.randomBytes(40).toString('hex');
    await redisClient.set(hash, response.data.access_token, 'EX', 30);

    // memo:
    /*
      1. check isUser
        Yes: setcookie,
          redirect to /callback?logged=1
        No: ...
    */
    let nextUrl = baseUrl;
    nextUrl += `callback?type=github&key=${hash}`;

    const { next } = ctx.query;
    if (next) {
      nextUrl += `&next=${next}`;
    }
    ctx.redirect(encodeURI(nextUrl));
    ctx.body = response.data;
  } catch (e) {
    console.log(e);
    ctx.status = 401;
    // redirect to velog
    let nextUrl =
      process.env.NODE_ENV === 'development'
        ? 'https://localhost:3000/'
        : 'https://velog.io/';
    nextUrl += 'callback?error=1';
    ctx.redirect(nextUrl);
  }
};

export const getToken: Middleware = async (ctx) => {
  // github, facebook, google
  const { key } = ctx.query;
  try {
    const token = await redisClient.get(key);
    if (!token) {
      ctx.status = 400;
      return;
    }
    ctx.body = {
      token,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

const { GOOGLE_ID, GOOGLE_SECRET } = process.env;

export const redirectGoogleLogin: Middleware = (ctx) => {
  const { next } = ctx.query;
  const callbackUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:4000/auth/callback/google'
      : 'https://api.velog.io/auth/callback/google';

  if (!GOOGLE_ID || !GOOGLE_SECRET) {
    console.log('Google ENVVAR is missing');
    ctx.throw(500);
  }

  const oauth2Client = new google.auth.OAuth2(
    GOOGLE_ID,
    GOOGLE_SECRET,
    callbackUrl,
  );

  const url = oauth2Client.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
    state: JSON.stringify({ next: next || '/trending' }),
  });

  console.log(url);
  ctx.redirect(url);
};

export const googleCallback: Middleware = async (ctx) => {
  const { code, state } = ctx.query;
  const callbackUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:4000/auth/callback/google'
      : 'https://api.velog.io/auth/callback/google';
  if (!code) {
    ctx.redirect(`${baseUrl}/?callback?error=1`);
    return;
  }

  if (!GOOGLE_ID || !GOOGLE_SECRET) {
    console.log('Google ENVVAR is missing');
    ctx.throw(500);
  }

  const oauth2Client = new google.auth.OAuth2(
    GOOGLE_ID,
    GOOGLE_SECRET,
    callbackUrl,
  );
  try {
    const { tokens } = await oauth2Client.getToken(code);
    if (!tokens) {
      ctx.status = 401;
      return;
    }
    const { access_token } = tokens;
    const hash = crypto.randomBytes(40).toString('hex');
    await redisClient.set(hash, access_token, 'EX', 300);
    let nextUrl = `${baseUrl}callback?type=google&key=${hash}`;
    if (state) {
      const { next } = JSON.parse(state);
      nextUrl += `&next=${next}`;
    }
    ctx.redirect(encodeURI(nextUrl));
  } catch (e) {
    ctx.throw(500, e);
  }
};

const { FACEBOOK_ID, FACEBOOK_SECRET } = process.env;

export const redirectFacebookLogin: Middleware = (ctx) => {
  const { next } = ctx.query;
  if (!FACEBOOK_ID) {
    ctx.throw(500, 'Facebook ID is missing');
    return;
  }
  const state = JSON.stringify({ next: next || '/trending' });
  const callbackUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:4000/auth/callback/facebook'
      : 'https://api.velog.io/auth/callback/facebook';
  const authUrl = `https://www.facebook.com/v3.2/dialog/oauth?client_id=${FACEBOOK_ID}&redirect_uri=${callbackUrl}&state=${state}&scope=email,public_profile`;
  ctx.redirect(encodeURI(authUrl));
};

export const facebookCallback: Middleware = async (ctx) => {
  const { code, state } = ctx.query;
  const callbackUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:4000/auth/callback/facebook'
      : 'https://api.velog.io/auth/callback/facebook';
  if (!code) {
    ctx.redirect(`${baseUrl}/?callback?error=1`);
    return;
  }

  if (!FACEBOOK_ID || !FACEBOOK_SECRET) {
    console.log('Facebook ENVVAR is missing');
    ctx.throw(500);
  }

  try {
    const response = await axios.get(`https://graph.facebook.com/v3.2/oauth/access_token?${qs.stringify({
      client_id: FACEBOOK_ID,
      redirect_uri: callbackUrl,
      client_secret: FACEBOOK_SECRET,
      code,
    })}`);
    const { access_token } = response.data;
    if (!access_token) {
      ctx.redirect(`${baseUrl}/?callback?error=1`);
      return;
    }
    const hash = crypto.randomBytes(40).toString('hex');
    await redisClient.set(hash, access_token, 'EX', 30);
    let nextUrl = `${baseUrl}callback?type=facebook&key=${hash}`;
    if (state) {
      const { next } = JSON.parse(state);
      nextUrl += `&next=${next}`;
    }
    ctx.redirect(encodeURI(nextUrl));
  } catch (e) {
    ctx.throw(500, e);
  }
};
