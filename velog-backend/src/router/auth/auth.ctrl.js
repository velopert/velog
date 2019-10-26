// @flow
import type { Context } from 'koa';
import Joi from 'joi';

import sendMail from 'lib/sendMail';
import User from 'database/models/User';
import UserProfile from 'database/models/UserProfile';
import EmailAuth from 'database/models/EmailAuth';
import SocialAccount from 'database/models/SocialAccount';
import EmailCert from 'database/models/EmailCert';
import { generate, decode } from 'lib/token';
import { sendCertEmail } from 'lib/common';
import getSocialProfile, { type Profile } from 'lib/getSocialProfile';
import type { UserModel } from 'database/models/User';
import type { UserProfileModel } from 'database/models/UserProfile';
import type { EmailAuthModel } from 'database/models/EmailAuth';
import downloadImage from 'lib/downloadImage';
import AWS from 'aws-sdk';
import UserMeta from '../../database/models/UserMeta';

const s3 = new AWS.S3({ region: 'ap-northeast-2', signatureVersion: 'v4' });

export const sendAuthEmail = async (ctx: Context): Promise<*> => {
  type BodySchema = {
    email: string,
  };

  const schema = Joi.object().keys({
    email: Joi.string()
      .email()
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

  try {
    const { email: rawEmail }: BodySchema = (ctx.request.body: any);
    const email = rawEmail.toLowerCase();

    // TODO: check email existancy
    const user = await User.findUser('email', email);
    const emailKeywords = user
      ? {
        type: 'email-login',
        text: '로그인',
      }
      : {
        type: 'register',
        text: '회원가입',
      };

    const verification: EmailAuthModel = await EmailAuth.build({
      email,
    }).save();

    await sendMail({
      to: email,
      subject: `Velog ${emailKeywords.text}`,
      from: 'Velog <verify@velog.io>',
      body: `<a href="https://velog.io"><img src="https://images.velog.io/email-logo.png" style="display: block; width: 128px; margin: 0 auto;"/></a>
      <div style="max-width: 100%; width: 400px; margin: 0 auto; padding: 1rem; text-align: justify; background: #f8f9fa; border: 1px solid #dee2e6; box-sizing: border-box; border-radius: 4px; color: #868e96; margin-top: 0.5rem; box-sizing: border-box;">
        <b style="black">안녕하세요! </b>${
  emailKeywords.text
}을 계속하시려면 하단의 링크를 클릭하세요. 만약에 실수로 요청하셨거나, 본인이 요청하지 않았다면, 이 메일을 무시하세요.
      </div>
      
      <a href="https://velog.io/${emailKeywords.type}?code=${
  verification.code
}" style="text-decoration: none; width: 400px; text-align:center; display:block; margin: 0 auto; margin-top: 1rem; background: #845ef7; padding-top: 1rem; color: white; font-size: 1.25rem; padding-bottom: 1rem; font-weight: 600; border-radius: 4px;">계속하기</a>
      
      <div style="text-align: center; margin-top: 1rem; color: #868e96; font-size: 0.85rem;"><div>위 버튼을 클릭하시거나, 다음 링크를 열으세요: <br/> <a style="color: #b197fc;" href="https://velog.io/${
  emailKeywords.type
}?code=${verification.code}">https://velog.io/${
  emailKeywords.type
}?code=${
  verification.code
}</a></div><br/><div>이 링크는 24시간동안 유효합니다. </div></div>`,
    });
    ctx.body = {
      isUser: !!user,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const getCode = async (ctx: Context): Promise<*> => {
  const { code } = ctx.params;

  try {
    const auth: EmailAuthModel = await EmailAuth.findCode(code);
    if (!auth) {
      ctx.status = 404;
      return;
    }
    const { email } = auth;

    const registerToken = await generate(
      { email },
      { expiresIn: '1h', subject: 'auth-register' },
    );

    ctx.body = {
      email,
      registerToken,
    };

    await auth.use();
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const codeLogin = async (ctx: Context): Promise<*> => {
  type BodySchema = {
    code: string,
  };

  const { code }: BodySchema = (ctx.request.body: any);

  if (typeof code !== 'string') {
    ctx.status = 400;
    return;
  }

  try {
    const auth: EmailAuthModel = await EmailAuth.findCode(code);
    if (!auth) {
      ctx.status = 404;
      return;
    }
    const { email } = auth;
    const user: UserModel = await User.findUser('email', email);

    if (!user) {
      ctx.status = 401;
      return;
    }

    const token = await user.generateToken();
    const profile: UserProfileModel = await user.getProfile();

    // $FlowFixMe: intersection bug
    ctx.cookies.set('access_token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      domain: process.env.NODE_ENV === 'development' ? undefined : '.velog.io',
    });

    ctx.body = {
      user: {
        id: user.id,
        username: user.username,
        displayName: profile.display_name,
        thumbnail: profile.thumbnail,
      },
      token,
    };
    await auth.use();
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const createLocalAccount = async (ctx: Context): Promise<*> => {
  type BodySchema = {
    registerToken: string,
    form: {
      displayName: string,
      username: string,
      shortBio: string,
    },
  };

  const schema = Joi.object().keys({
    registerToken: Joi.string().required(),
    form: Joi.object()
      .keys({
        displayName: Joi.string()
          .min(1)
          .max(40),
        username: Joi.string()
          .regex(/^[a-z0-9-_]+$/)
          .min(3)
          .max(16)
          .required(),
        shortBio: Joi.string()
          .allow('')
          .max(140)
          .optional(),
      })
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

  const {
    registerToken,
    form: { username, shortBio, displayName },
  }: BodySchema = (ctx.request.body: any);

  let decoded = null;

  try {
    decoded = await decode(registerToken);
  } catch (e) {
    ctx.status = 400;
    ctx.body = {
      name: 'INVALID_TOKEN',
    };
    return;
  }

  const { email } = decoded;

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
    const user: User = await User.build({
      username,
      email,
      is_certified: true,
    }).save();

    await UserProfile.build({
      fk_user_id: user.id,
      display_name: displayName,
      short_bio: shortBio,
    }).save();

    const token: string = await user.generateToken();

    // $FlowFixMe: intersection bug
    ctx.cookies.set('access_token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      domain: process.env.NODE_ENV === 'development' ? undefined : '.velog.io',
    });

    ctx.body = {
      user: {
        id: user.id,
        username: user.username,
        displayName,
      },
      token,
    };

    setTimeout(() => {
      UserMeta.build({
        fk_user_id: user.id,
        email_notification: true,
      }).save();
    }, 0);
  } catch (e) {
    ctx.throw(500, e);
  }
};

// TODO: query optimization needed
export const check = async (ctx: Context): Promise<*> => {
  if (!ctx.user) {
    ctx.status = 401;
    return;
  }

  try {
    const now = new Date();
    const user = await User.findById(ctx.user.id);
    if (!user) {
      // $FlowFixMe: intersection bug
      ctx.cookies.set('access_token', null, {
        domain:
          process.env.NODE_ENV === 'development' ? undefined : '.velog.io',
      });
      ctx.status = 401;
      return;
    }
    const profile = await user.getProfile();
    const data = {
      id: user.id,
      displayName: profile.display_name,
      thumbnail: profile.thumbnail,
      username: user.username,
    };
    if (ctx.tokenExpire - now < 1000 * 60 * 60 * 24 * 4) {
      try {
        const token = await user.generateToken();
        // $FlowFixMe: intersection bug
        ctx.cookies.set('access_token', token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 7,
          domain:
            process.env.NODE_ENV === 'development' ? undefined : '.velog.io',
        });
      } catch (e) {
        ctx.throw(500, e);
      }
    }
    ctx.body = {
      user: data,
    };
  } catch (e) {
    console.log(e);
  }
};

export const logout = (ctx: Context) => {
  // $FlowFixMe: intersection bug
  ctx.cookies.set('access_token', null, {
    domain: process.env.NODE_ENV === 'development' ? undefined : '.velog.io',
  });
  ctx.status = 204;
};

export const verifySocial = async (ctx: Context): Promise<*> => {
  type BodySchema = {
    accessToken: string,
  };

  const { accessToken }: BodySchema = (ctx.request.body: any);
  const { provider } = ctx.params;

  let profile: ?Profile = null;

  try {
    profile = await getSocialProfile(provider, accessToken);
  } catch (e) {
    console.log(e);
    ctx.status = 401;
    ctx.body = {
      name: 'WRONG_CREDENTIAL',
    };
  }

  if (!profile) {
    ctx.status = 401;
    ctx.body = {
      name: 'WRONG_CREDENTIAL',
    };
    return;
  }

  try {
    const [user, socialAccount] = await Promise.all([
      profile.email
        ? User.findUser('email', profile.email)
        : Promise.resolve(null),
      SocialAccount.findBySocialId(profile.id.toString()),
    ]);

    ctx.body = {
      profile,
      exists: !!(socialAccount || user),
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const socialRegister = async (ctx: Context): Promise<*> => {
  type BodySchema = {
    accessToken: string,
    form: {
      displayName: string,
      username: string,
      shortBio: string,
      fallbackEmail: string,
    },
  };

  const schema = Joi.object().keys({
    accessToken: Joi.string().required(),
    form: Joi.object()
      .keys({
        fallbackEmail: Joi.string(),
        displayName: Joi.string()
          .min(1)
          .max(40),
        username: Joi.string()
          .regex(/^[a-z0-9-_]+$/)
          .min(3)
          .max(16)
          .required(),
        shortBio: Joi.string()
          .allow('')
          .max(140)
          .optional(),
      })
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

  const { provider } = ctx.params;
  const { accessToken, form }: BodySchema = (ctx.request.body: any);

  let profile = null;

  try {
    profile = await getSocialProfile(provider, accessToken);
  } catch (e) {
    ctx.status = 401;
    ctx.body = {
      name: 'WRONG_CREDENTIALS',
    };
    return;
  }

  const { id, thumbnail, email } = profile;
  const {
    displayName, username, shortBio, fallbackEmail,
  } = form;
  const socialId = id.toString();

  const fallbackedEmail = email || fallbackEmail;
  console.log(fallbackedEmail);

  try {
    const [emailExists, usernameExists] = await Promise.all([
      fallbackedEmail
        ? User.findUser('email', fallbackedEmail)
        : Promise.resolve(null),
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

    const socialExists = await SocialAccount.findBySocialId(socialId);

    if (socialExists) {
      ctx.status = 409;
      ctx.body = {
        name: 'SOCIAL_ACCOUNT_EXISTS',
      };
      return;
    }

    const user: UserModel = await User.build({
      username,
      email: fallbackedEmail,
      is_certified: !!email,
    }).save();

    if (!email) {
      setTimeout(() => {
        sendCertEmail(user.id, fallbackedEmail);
      }, 0);
    }

    let uploadedThumbnail = null;
    try {
      const imageData = await downloadImage(thumbnail);
      const tempPath = `profiles/${username}/thumbnails/${new Date().getTime() /
        1000}.${imageData.extension}`;
      const uploadResult = await s3
        .upload({
          Bucket: 's3.images.velog.io',
          Key: tempPath,
          Body: imageData.stream,
          ContentType: imageData.contentType,
        })
        .promise();
      if (!uploadResult || !uploadResult.ETag) {
        throw new Error('upload has failed');
      }
      uploadedThumbnail = `https://images.velog.io/${tempPath}`;
    } catch (e) {
      console.log(e);
      console.log('image sync failed');
    }

    await UserProfile.build({
      fk_user_id: user.id,
      display_name: displayName,
      short_bio: shortBio,
      thumbnail: uploadedThumbnail,
    }).save();

    // create SocialAccount row;
    await SocialAccount.build({
      fk_user_id: user.id,
      social_id: id.toString(),
      provider,
      access_token: accessToken,
    }).save();

    ctx.body = user.getProfile();

    const token: string = await user.generateToken();

    // $FlowFixMe: intersection bug
    ctx.cookies.set('access_token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      domain: process.env.NODE_ENV === 'development' ? undefined : '.velog.io',
    });

    ctx.body = {
      user: {
        id: user.id,
        username: user.username,
        displayName,
        thumbnail: uploadedThumbnail,
      },
      token,
    };

    setTimeout(() => {
      UserMeta.build({
        fk_user_id: user.id,
        email_notification: true,
      }).save();
    }, 0);
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const socialLogin = async (ctx: Context): Promise<*> => {
  type BodySchema = {
    accessToken: string,
  };

  const { accessToken }: BodySchema = (ctx.request.body: any);
  const { provider } = ctx.params;

  if (typeof accessToken !== 'string') {
    ctx.status = 400;
    return;
  }

  let profile: ?Profile = null;

  try {
    profile = await getSocialProfile(provider, accessToken);
  } catch (e) {
    ctx.status = 401;
    ctx.body = {
      name: 'WRONG_CREDENTIALS',
    };
  }

  if (profile === null || profile === undefined) {
    ctx.status = 401;
    ctx.body = {
      name: 'WRONG_CREDENTIALS',
    };
    return;
  }

  const socialId = profile.id.toString();
  try {
    let user = await SocialAccount.findUserBySocialId(socialId);
    if (!user) {
      // if socialaccount not found, try find by email
      if (profile.email) {
        user = await User.findUser('email', profile.email);
      }
      if (!user) {
        ctx.status = 401;
        ctx.body = {
          name: 'NOT_REGISTERED',
        };
        return;
      }
      // if user is found, link social account
      await SocialAccount.build({
        fk_user_id: user.id,
        social_id: profile.id.toString(),
        provider,
        access_token: accessToken,
      }).save();
    }

    const userProfile = await user.getProfile();
    const token = await user.generateToken();

    ctx.body = {
      user: {
        id: user.id,
        username: user.username,
        displayName: userProfile.display_name,
        thumbnail: userProfile.thumbnail,
      },
      token,
    };

    // $FlowFixMe: intersection bug
    ctx.cookies.set('access_token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      domain: process.env.NODE_ENV === 'development' ? undefined : '.velog.io',
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const certifyEmail = async (ctx: Context) => {
  const { code } = ctx.query;
  if (!code) {
    ctx.status = 400;
    return;
  }
  try {
    const cert = await EmailCert.findOne({
      where: {
        code,
      },
    });
    if (!cert) {
      ctx.status = 404;
      return;
    }
    if (!cert.status) {
      ctx.status = 409;
      ctx.body = {
        name: 'DISABLED_CODE',
      };
      return;
    }
    const d = new Date(cert.created_at);
    if (Date.now() - d.getTime() > 1000 * 60 * 60 * 24) {
      ctx.status = 409;
      ctx.body = {
        name: 'EXPIRED_CODE',
      };
      return;
    }
    const user = await User.findById(cert.fk_user_id);
    if (!user) {
      ctx.status = 500;
      ctx.body = {
        name: 'INVALID_USER',
      };
      return;
    }
    user.is_certified = true;
    cert.status = false;
    await Promise.all([user.save(), cert.save()]);
    ctx.status = 204;
  } catch (e) {
    ctx.throw(500, e);
  }
};
