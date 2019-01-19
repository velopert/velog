// @flow
import type { Context } from 'koa';
import UserProfile from 'database/models/UserProfile';
import { validateSchema, checkEmpty, sendCertEmail } from 'lib/common';
import { generate, decode } from 'lib/token';

import Joi from 'joi';
import User from '../../database/models/User';
import UserMeta from '../../database/models/UserMeta';
import EmailCert from '../../database/models/EmailCert';

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
      attributes: [
        'id',
        'display_name',
        'short_bio',
        'thumbnail',
        'profile_links',
      ],
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
      profile_links: profile.profile_links,
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
    // process unregister
    ctx.status = 204;
  } catch (e) {
    ctx.status = 400;
  }
};

export const getEmailInfo = async (ctx: Context) => {
  try {
    const user = await User.findById(ctx.user.id);
    const userMeta = await UserMeta.findOne({
      where: {
        fk_user_id: ctx.user.id,
      },
    });

    const { email_notification, email_promotion } = userMeta;
    const { email, is_certified } = user;
    ctx.body = {
      email,
      is_certified,
      permissions: {
        email_notification,
        email_promotion,
      },
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const changeEmail = async (ctx: Context) => {
  // validate email
  const schema = Joi.object().keys({
    email: Joi.string()
      .email()
      .required(),
  });
  const result = Joi.validate(ctx.request.body, schema);
  if (result.error) {
    ctx.body = {
      name: 'WRONG_EMAIL',
    };
    ctx.status = 400;
    return;
  }

  // parse email from reqbody
  const { email } = ((ctx.request.body: any): { email: string });

  try {
    // get user
    const user = await User.findById(ctx.user.id);
    // do duplication check
    const exists = await User.findOne({
      where: {
        email,
      },
    });
    if (exists) {
      ctx.status = 409;
      ctx.body = {
        name: 'EMAIL_EXISTS',
      };
      return;
    }

    // change email
    user.email = email;
    user.is_certified = false;
    await user.save();
    // list all email certs and disable status
    await EmailCert.update(
      {
        status: false,
      },
      {
        where: {
          fk_user_id: ctx.user.id,
          status: true,
        },
      },
    );
    sendCertEmail(ctx.user.id, email);
    ctx.status = 204;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const resendCertmail = async (ctx: Context) => {
  try {
    const user = await User.findById(ctx.user.id);
    if (user.is_certified) {
      ctx.status = 409;
      ctx.body = {
        name: 'ALREADY_CERTIFIED',
      };
      return;
    }
    sendCertEmail(ctx.user.id, user.email);
    ctx.status = 204;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const updateEmailPermissions = async (ctx: Context) => {
  // validate request body
  const schema = Joi.object().keys({
    email_notification: Joi.boolean().required(),
    email_promotion: Joi.boolean().required(),
  });
  const result = Joi.validate(ctx.request.body, schema);
  if (result.error) {
    ctx.status = 400;
    return;
  }
  const permissions: {
    email_notification: boolean,
    email_promotion: boolean,
  } = (ctx.request.body: any);

  try {
    const userMeta = await UserMeta.findOne({
      where: {
        fk_user_id: ctx.user.id,
      },
    });
    await userMeta.update(permissions);
    ctx.status = 204;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const updateProfileLinks = async (ctx: Context) => {
  const schema = Joi.object().keys({
    email: Joi.string()
      .email()
      .allow(''),
    facebook: Joi.string().allow(''),
    github: Joi.string().allow(''),
    twitter: Joi.string().allow(''),
    url: Joi.string().allow(''),
  });

  if (!validateSchema(ctx, schema)) {
    return;
  }

  type ProfileLinks = {
    email?: string,
    facebook?: string,
    github?: string,
    twitter?: string,
    url?: string,
  };

  const { user } = ctx;

  const profile_links: ProfileLinks = (ctx.request.body: any);

  try {
    const profile = await UserProfile.findOne({
      where: {
        fk_user_id: user.id,
      },
    });
    if (!profile) {
      ctx.throw(500, 'Invalid Profile');
    }
    profile.profile_links = profile_links;
    await profile.save();
    ctx.body = profile_links;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const updateAbout = async (ctx: Context) => {
  const { content } = (ctx.request.body: any);
  if (typeof content !== 'string') {
    ctx.status = 400;
    return;
  }
  const { user } = ctx;
  try {
    const profile = await UserProfile.findOne({
      where: {
        fk_user_id: user.id,
      },
    });
    if (!profile) {
      ctx.throw(500, 'Invalid Profile');
    }
    profile.about = content;
    await profile.save();
    ctx.body = {
      about: content,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};
