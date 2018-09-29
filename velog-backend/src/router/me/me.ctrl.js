// @flow
import type { Context } from 'koa';
import UserProfile from 'database/models/UserProfile';
import { validateSchema } from 'lib/common';
import { generate, decode } from 'lib/token';

import Joi from 'joi';
import User from '../../database/models/User';
import { checkEmpty } from '../../lib/common';

export const updateProfile = async (ctx: Context): Promise<*> => {
  const { user } = ctx;

  const schema = Joi.object().keys({
    display_name: Joi.string()
      .min(1)
      .max(40),
    short_bio: Joi.string().max(140),
    thumbnail: Joi.string(),
  });

  if (!validateSchema(ctx, schema)) {
    return;
  }

  type BodySchema = {
    display_name?: string,
    short_bio?: string,
    thumbnail?: string,
  };

  const body: BodySchema = (ctx.request.body: any);

  const { display_name } = body;
  if (display_name && checkEmpty(display_name)) {
    ctx.status = 400;
    ctx.body = {
      name: 'INVALID_NAME',
    };
    return;
  }

  try {
    const profile = await UserProfile.findOne({
      where: {
        fk_user_id: user.id,
      },
      attributes: ['id', 'display_name', 'short_bio', 'thumbnail'],
    });
    if (!profile) {
      ctx.throw(500, 'Invalid Profile');
    }

    ['display_name', 'short_bio', 'thumbnail'].forEach((key) => {
      if (body[key]) {
        profile[key] = body[key];
      }
    });

    await profile.save();

    ctx.body = {
      user_id: user.id,
      display_name: profile.display_name,
      thumbnail: profile.thumbnail,
      short_bio: profile.short_bio,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const generateUnregisterToken = async (ctx: Context) => {
  const { username } = ctx.user;
  try {
    const token = await generate(
      { username },
      {
        expiresIn: '1h',
        subject: 'unregister',
      },
    );
    ctx.body = {
      unregister_token: token,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const unregister = async (ctx: Context) => {
  const { username, id } = ctx.user;
  const schema = Joi.object().keys({
    unregister_token: Joi.string().required(),
  });

  if (!validateSchema(ctx, schema)) return;

  const unregisterToken = (ctx.request.body: any).unregister_token;
  try {
    const decoded = await decode(unregisterToken);
    if (decoded.username !== username) {
      ctx.status = 400;
      return;
    }
    const user = await User.findById(id);
    await user.destroy();
    ctx.cookies.set('access_token', '');
    // 탈퇴처리
    ctx.status = 204;
  } catch (e) {
    ctx.status = 400;
  }
};
