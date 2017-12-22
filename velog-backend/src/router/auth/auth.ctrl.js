// @flow
import type { Context } from 'koa';
import Joi from 'joi';
import mailgun from 'mailgun-js';


import User from 'database/models/User';
import UserProfile from 'database/models/UserProfile';
import EmailVerification from 'database/models/EmailVerification';

import type { UserModel } from 'database/models/User';
import type { UserProfileModel } from 'database/models/UserProfile';
import type { EmailVerificationModel } from 'database/models/EmailVerification';

const { MAILGUN_KEY: mailgunKey } = process.env;

const sendVerificationEmail = ({ email, code }: { email: string, code: string }): Promise<*> => {
  const mg = mailgun({
    apiKey: mailgunKey,
    domain: 'mg.velog.io',
  });

  const data = {
    from: 'Velog <verification@velog.io>',
    to: email,
    subject: 'Velog 이메일 회원가입',
    html: `
    <a href="https://velog.io"><img src="https://i.imgur.com/xtxnddg.png" style="display: block; width: 128px; margin: 0 auto;"/></a>
    <div style="max-width: 100%; width: 400px; margin: 0 auto; padding: 1rem; text-align: justify; background: #f8f9fa; border: 1px solid #dee2e6; box-sizing: border-box; border-radius: 4px; color: #868e96; margin-top: 0.5rem; box-sizing: border-box;">
      <b style="black">velog 에 오신것을 환영합니다! </b>회원가입을 계속하시려면 하단의 링크를 클릭하세요. 만약에 실수로 가입하셨거나, 본인이 가입신청하지 않았다면, 이 메일을 무시하세요.
    </div>
    
    <a href="https://velog.io/register?code=${code}" style="text-decoration: none; width: 400px; text-align:center; display:block; margin: 0 auto; margin-top: 1rem; background: #845ef7; padding-top: 1rem; color: white; font-size: 1.25rem; padding-bottom: 1rem; font-weight: 600; border-radius: 4px;">velog 가입하기</a>
    
    <div style="text-align: center; margin-top: 1rem; color: #868e96; font-size: 0.85rem;"><div>위 버튼을 클릭하시거나, 다음 링크를 열으세요: <br/> <a style="color: #b197fc;" href="https://velog.io/register?code=${code}">https://velog.io/register?code=${code}</a></div><br/><div>이 링크는 24시간동안 유효합니다. </div></div>`,
  };

  return mg.messages().send(data);
};

export const verifyEmail = async (ctx: Context): Promise<*> => {
  type BodySchema = {
    email: string
  };

  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
  });

  const result: any = Joi.validate(ctx.request.body, schema);

  if (result.error) {
    ctx.status = 400;
    ctx.body = {
      name: 'WRONG_SCHEMA',
      payload: result.error,
    };
    return;
  }

  try {
    const { email } : BodySchema = (ctx.request.body: any);
    const verification: EmailVerificationModel = await EmailVerification.build({
      email,
    }).save();
    const data = await sendVerificationEmail({
      email,
      code: verification.code,
    });
    console.log(data);
  } catch (e) {
    ctx.throw(500, e);
  }
  ctx.body = {
    status: true,
  };
};

export const createLocalAccount = async (ctx: Context): Promise<*> => {
  type BodySchema = {
    email: string,
    password: string,
    username: string
  };

  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    username: Joi.string().alphanum().min(3).max(20)
      .required(),
  });

  const result: any = Joi.validate(ctx.request.body, schema);

  if (result.error) {
    ctx.status = 400;
    ctx.body = {
      name: 'WRONG_SCHEMA',
      payload: result.error,
    };
    return;
  }

  const { email, password, username }: BodySchema = (ctx.request.body: any);

  try {
    const [emailExists, usernameExists] = await Promise.all([
      User.findUser('email', email),
      User.findUser('username', username),
    ]);

    if (emailExists || usernameExists) {
      ctx.status = 409;
      ctx.body = {
        name: 'DUPLICATED_ACCOUNT',
        payload: emailExists ? 'email' : 'username',
      };
      return;
    }
  } catch (e) {
    console.log(e);
  }

  try {
    const hash = await User.crypt(password);
    const user:User = await User.build({
      username,
      email,
      password_hash: hash,
    }).save();

    const userProfile = await UserProfile.build({
      fk_user_id: user.id,
    }).save();

    const token: string = await user.generateToken();

    // $FlowFixMe: intersection bug
    ctx.cookies.set('access_token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    ctx.body = {
      user: {
        id: user.id,
        username: user.username,
      },
      token,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const localLogin = async (ctx: Context): Promise<*> => {
  type BodySchema = {
    email?: string,
    password: string,
    username?: string
  };

  const { email, username, password }: BodySchema = (ctx.request.body: any);

  // neither email & username not given
  if (!(email || username)) {
    ctx.status = 401;
    ctx.body = {
      name: 'LOGIN_FAILURE',
    };
    return;
  }

  const schema = Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string().min(6).required(),
    username: Joi.string().alphanum().min(3).max(20),
  });

  // somehow wrong schema
  const result: any = Joi.validate(ctx.request.body, schema);
  if (result.error) {
    ctx.status = 401;
    ctx.body = {
      name: 'LOGIN_FAILURE',
    };
    return;
  }

  try {
    const value: any = email || username;
    const type: ('email' | 'username') = email ? 'email' : 'username';

    const user: UserModel = await User.findUser(type, value);

    if (!user) {
      ctx.status = 401;
      ctx.body = {
        name: 'LOGIN_FAILURE',
      };
      return;
    }

    const validated: boolean = await user.validatePassword(password);
    if (!validated) {
      ctx.status = 401;
      ctx.body = {
        name: 'LOGIN_FAILURE',
      };
      return;
    }

    const token: string = await user.generateToken();

    // set-cookie
    // $FlowFixMe: intersection bug
    ctx.cookies.set('access_token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    ctx.body = {
      user: {
        id: user.id,
        username: user.username,
      },
      token,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const check = async (ctx: Context): Promise<*> => {
  ctx.body = ctx.user;
};