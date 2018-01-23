// @flow

import Sequelize from 'sequelize';
import Joi from 'joi';

export const primaryUUID = {
  type: Sequelize.UUID,
  defaultValue: Sequelize.UUIDV1,
  primaryKey: true,
};

// validates schema, return 400 error if not valid
export const validateSchema = (ctx, schema) => {
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

export const filterUnique = (array: Array<*>): Array<*> => {
  return [...new Set(array)];
};
