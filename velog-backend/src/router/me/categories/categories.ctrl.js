// @flow
import type { Context } from 'koa';
import Joi from 'joi';
import { validateSchema } from 'lib/common';
import { Category } from 'database/models';

export const listCategories = async (ctx: Context): Promise<*> => {
  const { id: userId } = ctx.user;

  try {
    const categories = await Category.listAllCategories(userId);
    ctx.body = categories;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const createCategory = async (ctx: Context): Promise<*> => {
  type BodySchema = {
    name: string
  };

  const schema = Joi.object().keys({
    name: Joi.string().required().min(1).max(40),
  });

  if (!validateSchema(ctx, schema)) return;

  const { name }: BodySchema = (ctx.request.body: any);
  const { id: userId } = ctx.user;

  try {
    const count = await Category.countRootCategories(userId);
    const category = await Category.build({
      name,
      order: count,
      fk_user_id: userId,
    }).save();
    ctx.body = category.toJSON();
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const renameCategory = async (ctx: Context): Promise<*> => {
  const { id } = ctx.params;
  // TODO: find category using userId, id
  // check category exists
  // rename category, save.
};
