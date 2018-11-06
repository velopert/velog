// @flow
import type { Context, Middleware } from 'koa';
import Joi from 'joi';
import { validateSchema, extractKeys, isUUID } from 'lib/common';
import PostHistory from 'database/models/PostHistory';

export const tempSave = async (ctx: Context): Promise<*> => {
  type BodySchema = {
    title: string,
    body: string,
    is_release: boolean,
  };

  const { id } = ctx.params;

  const schema = Joi.object().keys({
    title: Joi.string()
      .min(1)
      .max(120),
    body: Joi.string().min(1),
    is_release: Joi.boolean(),
  });

  if (!validateSchema(ctx, schema)) return;

  const { title, body, is_release }: BodySchema = (ctx.request.body: any);

  // TODO: compare with the last data; if same => cancel.

  try {
    const postHistory = await PostHistory.build({
      fk_post_id: id,
      title,
      body,
      is_release,
    }).save();

    // 1. count all postHistory by fk_post_id
    // 2. if count > 20, get 10th data
    // 3. remove every data before 10th data.

    ctx.body = extractKeys(postHistory, [
      'id',
      'title',
      'body',
      'created_at',
      'is_release',
    ]);

    setTimeout(async () => {
      const count = await PostHistory.count({
        where: {
          fk_post_id: id,
        },
      });
      console.log(count);
    }, 0);
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const loadTempSave: Middleware = async (ctx) => {
  const { id, saveId } = ctx.params;
  if (!isUUID(saveId)) {
    ctx.body = {
      name: 'NOT_UUID',
    };
    ctx.status = 400;
    return;
  }
  try {
    const postHistory = await PostHistory.findOne({
      attributes: ['id', 'title', 'body', 'created_at'],
      where: {
        fk_post_id: id,
        id: saveId,
      },
    });
    ctx.body = postHistory;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const getTempSaveList: Middleware = async (ctx: Context) => {
  const { id } = ctx.params;
  const page = parseInt(ctx.query.page || 1, 10);

  try {
    const count = await PostHistory.countTempSaves(id);
    const data = await PostHistory.list(id, page);
    const serialize = row => extractKeys(row, ['id', 'created_at', 'title']);
    ctx.body = data.map(serialize);
    ctx.set('Page-Limit', Math.ceil(count / 10).toString());
  } catch (e) {
    ctx.throw(500, e);
  }
};
