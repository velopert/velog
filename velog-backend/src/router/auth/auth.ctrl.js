// @flow
import type { Context } from 'koa';
import Joi from 'joi';

import User from 'database/models/User';
import type { UserModel } from 'database/models/User';


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

    console.log(user);

    const token: string = await user.generateToken();
    ctx.body = {
      user,
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

    const validated: boolean = await user.validatePassword(password);
    if (!validated) {
      ctx.status = 401;
      ctx.body = {
        name: 'LOGIN_FAILURE',
      };
      return;
    }

    const token: string = await user.generateToken();
    ctx.body = {
      token,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};
