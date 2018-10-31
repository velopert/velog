// @flow
import type { Middleware } from 'koa';
import axios from 'axios';

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
    ctx.body = response.data;
  } catch (e) {
    ctx.status = 401;
    // redirect to velog
  }
};
