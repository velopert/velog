// @flow
import type { Middleware } from 'koa';
import axios from 'axios';
import crypto from 'crypto';
import redisClient from 'lib/redisClient';

// https://github.com/login/oauth/authorize?scope=user:email&client_id=f51c5f7d1098d4a1cbdf
// memo: http://localhost:4000/auth/callback/github?next=https://velog.io/&code=906e127c5d573424a53e
export const githubCallback: Middleware = async (ctx) => {
  try {
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: 'f51c5f7d1098d4a1cbdf',
        client_secret: '78ff1213c152f3c5f63953796cda33cde44658a7',
        code: ctx.query.code,
      },
      {
        headers: {
          accept: 'application/json',
        },
      },
    );
    const hash = crypto.randomBytes(40).toString('hex');
    const msg = await redisClient.set(
      hash,
      response.data.access_token,
      'EX',
      30,
    );

    // memo:
    /*
      1. check isUser
        Yes: setcookie,
          redirect to /callback?logged=1
        No: ...
    */
    let nextUrl =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/'
        : 'https://velog.io/';
    nextUrl += `callback?type=github&key=${hash}`;
    ctx.redirect(nextUrl);
    ctx.body = response.data;
  } catch (e) {
    ctx.status = 401;
    // redirect to velog
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
