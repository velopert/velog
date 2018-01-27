// @flow
import type { Context } from 'koa';
import Joi from 'joi';
import Sequelize from 'sequelize';
import { validateSchema } from 'lib/common';
import { Category } from 'database/models';

const { Op, literal } = Sequelize;


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

  type BodySchema = {
    name: string
  };

  const schema = Joi.object().keys({
    name: Joi.string().required().min(1).max(40),
  });

  if (!validateSchema(ctx, schema)) return;

  const { id: userId } = ctx.user;
  const { name }: BodySchema = (ctx.request.body: any);

  const category = await Category.findOne({
    attributes: ['id', 'order', 'parent', 'private', 'name'],
    where: {
      id,
      fk_user_id: userId,
    },
  });

  if (!category) {
    ctx.status = 404;
    return;
  }

  category.name = name;
  await category.save();
  ctx.body = category.toJSON();
};

export const deleteCategory = async (ctx: Context): Promise<*> => {
  const { id } = ctx.params;
  const { id: userId } = ctx.user;

  const category = await Category.findOne({
    attributes: ['id', 'order', 'parent', 'private', 'name'],
    where: {
      id,
      fk_user_id: userId,
    },
  });

  if (!category) {
    ctx.status = 404;
    return;
  }

  // {
  //   where: {
  //     fk_user_id: userId,
  //     order: {
  //       [Op.gt]: category.order,
  //     },
  //     parent: category.parent,
  //   },
  // }

  try {
    await category.destroy();
    // find categories below & order - 1
    await Category.update({
      order: literal('"order" - 1'),
    }, {
      where: {
        fk_user_id: userId,
        order: {
          $gt: category.order,
        },
        parent: category.parent,
      },
    });
    ctx.status = 204;
  } catch (e) {
    ctx.throw(500, e);
  }
};
