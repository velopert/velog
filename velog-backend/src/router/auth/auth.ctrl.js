// @flow
import type { Context } from 'koa';
import Joi from 'joi';

import User from 'database/models/User';


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
      User.getExistancy('email', email),
      User.getExistancy('username', username),
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
    const user = await User.build({
      username,
      email,
      password_hash: hash,
    }).save();
    console.log(user.generateToken());
    ctx.body = user.dataValues;
  } catch (e) {
    ctx.throw(500, e);
  }
};
