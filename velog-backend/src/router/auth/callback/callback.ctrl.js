// @flow
import type { Middleware } from 'koa';
import axios from 'axios';
import crypto from 'crypto';
import redisClient from 'lib/redisClient';
import { google } from 'googleapis';

const baseUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/'
    : 'https://velog.io/';

const callbackUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:4000/auth/callback/google'
    : 'https://api.velog.io/auth/callback/google';

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
        ? 'http://localhost:3000/'
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
    scope: ['https://www.googleapis.com/auth/userinfo.email'],
  });
  ctx.redirect(url);
};

export const googleCallback: Middleware = async (ctx) => {
  const { code } = ctx.query;
  if (!code) {
    ctx.redirect(`${baseUrl}/?callback?error=1`);
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
    await redisClient.set(hash, access_token, 'EX', 30);
    const nextUrl = encodeURI(`${baseUrl}callback?type=google&key=${hash}`);
    ctx.redirect(nextUrl);
  } catch (e) {
    ctx.throw(500, e);
  }
};
