// @flow
import type { Context } from 'koa';
import UserProfile from 'database/models/UserProfile';
import { validateSchema } from 'lib/common';
import Joi from 'joi';

export const updateProfile = async (ctx: Context): Promise<*> => {
  const { user } = ctx;

  const schema = Joi.object().keys({
    display_name: Joi.string()
      .min(1)
      .max(40),
    short_bio: Joi.string().max(140),
  });

  if (!validateSchema(ctx, schema)) {
    return;
  }

  type BodySchema = {
    display_name?: string,
    short_bio?: string,
  };

  const body: BodySchema = (ctx.request.body: any);

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

    ['display_name', 'short_bio'].forEach((key) => {
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
