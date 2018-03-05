// @flow
import type { Context } from 'koa';
import Joi from 'joi';
import Sequelize from 'sequelize';
import { validateSchema } from 'lib/common';
import { Category } from 'database/models';
import _ from 'lodash';

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
    name: string,
    urlSlug: string,
  };

  const schema = Joi.object().keys({
    name: Joi.string().required().min(1).max(40),
    urlSlug: Joi.string().min(1).max(40),
  });

  if (!validateSchema(ctx, schema)) return;

  const { name, urlSlug }: BodySchema = (ctx.request.body: any);
  const { id: userId } = ctx.user;

  const urlSlugWithFallback = (urlSlug || name).replace(/ /g, '-');

  try {
    const exists = await Category.checkUrlSlugExists(userId, urlSlugWithFallback);
    if (exists) {
      ctx.status = 409;
      ctx.body = {
        name: 'URL_SLUG_DUPLICATE',
      };
      return;
    }
    const count = await Category.countRootCategories(userId);
    const category = await Category.build({
      name,
      url_slug: urlSlugWithFallback,
      order: count,
      fk_user_id: userId,
    }).save();
    ctx.body = category.toJSON();
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const reorderCategories = async (ctx: Context): Promise<*> => {
  type OrderInfo = {
    id: string,
    order: number
  };

  type BodySchema = Array<OrderInfo>;

  const schema = Joi.array().items(Joi.object().keys({
    id: Joi.string().uuid(),
    order: Joi.number(),
  }));

  if (!validateSchema(ctx, schema)) return;

  const { id: userId } = ctx.user;

  let categories = null;
  try {
    categories = await Category.listAllCategories(userId, false);
  } catch (e) {
    ctx.throw(500, e);
  }
  if (!categories) return;

  const categoryOrders: BodySchema = (ctx.request.body: any);

  // check whether everything matches
  const match = (category) => {
    if (categories === null) return false;
    const index = categoryOrders.findIndex(co => co.id === category.id);
    if (index === -1) return false;
    return true;
  };

  let everythingMatches = true;

  categories.forEach((category) => {
    if (!everythingMatches) return false;
    everythingMatches = match(category);
  });

  if (!everythingMatches) {
    ctx.body = {
      name: 'CATEGORIES_MISMATCH',
    };
    ctx.status = 409;
    return;
  }

  // sort category, assign order id
  const sortCategoryOrder = (a: any, b: any) => a.order - b.order;
  const sorted = categoryOrders.sort(sortCategoryOrder)
    .map((category, i) => ({ ...category, order: i }));

  // convert to flat map
  const idMap = _.chain(sorted).keyBy('id').mapValues('order').value();

  // update category if order differs
  const promises = categories.map((category) => {
    const { id, order } = category;
    const currentOrder = idMap[id];
    if (order !== currentOrder) {
      return category.update({
        order: currentOrder,
      });
    }
    return Promise.resolve();
  });

  try {
    await promises;
  } catch (e) {
    ctx.throw(500, e);
  }

  ctx.body = categories.sort(sortCategoryOrder);
};

// TODO: enhance to patchCategory (for urlSlug)
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

  // TODO: unset categories
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
