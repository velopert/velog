// @flow
import Sequelize from 'sequelize';
import Joi from 'joi';
import type { Middleware } from 'koa';

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
  return `${Math.floor(36 + (Math.random() * 1259)).toString(36)}${Date.now().toString(36)}`;
};

export const escapeForUrl = (text: string): string => {
  return text.replace(/[^0-9a-zA-Zㄱ-힣\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf ]/g, ' ')
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
