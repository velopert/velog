// @flow
import Sequelize from 'sequelize';
import Joi from 'joi';
import type { Middleware } from 'koa';
import removeMd from 'remove-markdown';
import crypto from 'crypto';
import axios from 'axios';
import sendMail from 'lib/sendMail';
import EmailCert from 'database/models/EmailCert';
import { generate } from './token';

export const primaryUUID = {
  type: Sequelize.UUID,
  defaultValue: Sequelize.UUIDV1,
  primaryKey: true,
};

// validates schema, return 400 error if not valid
export const validateSchema = (ctx: any, schema: any): any => {
  const result = Joi.validate(ctx.request.body, schema);
  if (result.error) {
    ctx.status = 400;
    ctx.body = {
      name: 'WRONG_SCHEMA',
      payload: result.error,
    };
    return false;
  }
  return true;
};

export const filterUnique = (array: Array<string>): Array<string> => {
  return [...new Set(array)];
};

export const isUUID = (name: string) => {
  const validation = Joi.validate(name, Joi.string().uuid());
  if (validation.error) return false;
  return true;
};

export const checkUUID: Middleware = (ctx, next) => {
  const { id } = ctx.params;
  if (!isUUID(id)) {
    ctx.status = 400;
    ctx.body = {
      name: 'NOT_UUID',
    };
    return;
  }
  return next();
};

export const generateSlugId = (): string => {
  return `${Math.floor(36 + Math.random() * 1259).toString(36)}${Date.now().toString(36)}`;
};

export const escapeForUrl = (text: string): string => {
  return text
    .replace(
      /[^0-9a-zA-Zㄱ-힣.\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf -]/g,
      '',
    )
    .replace(/ /g, '-')
    .replace(/--+/g, '-');
};

export const extractKeys = (object: any, params: Array<string>): any => {
  const converted = {};
  params.forEach((key) => {
    converted[key] = object[key];
  });
  return converted;
};

export function formatShortDescription(markdown: string): string {
  const replaced = markdown
    .replace(/  +/g, '')
    .replace(/--/g, '')
    .replace(/\|/g, '')
    .replace(/\n/g, ' ')
    .replace(/```(.*)```/g, '')
    .replace(/[<>]/g, '');

  return (
    removeMd(replaced.slice(0, 500))
      .slice(0, 200)
      .replace(/#/g, '') + (replaced.length > 200 ? '...' : '')
  );
}

export function formatShortDescriptionForAtom(markdown: string): string {
  const replaced = markdown
    .replace(/  +/g, '')
    .replace(/--/g, '')
    .replace(/\|/g, '')
    .replace(/\n/g, ' ')
    .replace(/```(.*)```/g, '')
    .replace(/[<>]/g, '');

  return (
    removeMd(replaced.slice(0, 1200))
      .slice(0, 1200)
      .replace(/#/g, '') + (replaced.length > 1000 ? '...' : '')
  );
}

export function generalHash(text: string) {
  const hashKey = process.env.HASH_KEY;
  if (!hashKey) return null;
  const hash = crypto
    .createHmac('sha256', hashKey)
    .update(text)
    .digest('hex');
  return hash;
}

export function checkEmpty(text: string) {
  if (!text) return true;
  const replaced = text
    .trim()
    .replace(
      /([\u3164\u115F\u1160\uFFA0\u200B\u0001-\u0008\u000B-\u000C\u000E-\u001F]+)/g,
      '',
    )
    .replace(/&nbsp;/, '');
  if (replaced === '') return true;
  return false;
}

export function refreshSitemap() {
  return axios.get('https://google.com/ping?sitemap=https://velog.io/sitemaps/index.xml');
}

export function normalize(array: any[], key: string) {
  const byId = {};
  const allIds = [];
  array.forEach((item) => {
    byId[item[key]] = item;
    allIds.push(item[key]);
  });
  return {
    byId,
    allIds,
  };
}

export function generateUnsubscribeToken(userId: string, metaField: string) {
  return generate(
    {
      user_id: userId,
      meta_field: metaField,
    },
    {
      subject: 'unsubscribe-email',
      expiresIn: null,
    },
  );
}

export function getHost() {
  return process.env.NODE_ENV === 'development'
    ? 'https://localhost:3000/'
    : 'https://velog.io/';
}

export async function sendCertEmail(userId: string, email: string) {
  const emailCert = await EmailCert.build({
    fk_user_id: userId,
  }).save();
  await sendMail({
    to: email,
    subject: 'Velog 이메일 인증',
    from: 'Velog <verify@velog.io>',
    body: `<a href="https://velog.io"><img src="https://images.velog.io/email-logo.png" style="display: block; width: 128px; margin: 0 auto;"/></a>
<div style="max-width: 100%; width: 400px; margin: 0 auto; padding: 1rem; text-align: justify; background: #f8f9fa; border: 1px solid #dee2e6; box-sizing: border-box; border-radius: 4px; color: #868e96; margin-top: 0.5rem; box-sizing: border-box; text-align: center;">
  안녕하세요! velog 이메일 인증을 진행하시려면 <br/>다음 버튼을 눌러주세요.
</div>

<a href="https://velog.io/certify?code=${
  emailCert.code
}" style="text-decoration: none; width: 400px; text-align:center; display:block; margin: 0 auto; margin-top: 1rem; background: #845ef7; padding-top: 1rem; color: white; font-size: 1.25rem; padding-bottom: 1rem; font-weight: 600; border-radius: 4px;">이메일 인증</a>

<div style="text-align: center; margin-top: 1rem; color: #868e96; font-size: 0.85rem;"><div>혹은, 다음 링크를 열어주세요:<br/> <a style="color: #b197fc;" href="https://velog.io/certify?code=${
  emailCert.code
}">https://velog.io/certify?code=${
  emailCert.code
}</a></div><br/><div>이 링크는 24시간동안 유효합니다. </div></div>`,
  });
  return emailCert;
}
