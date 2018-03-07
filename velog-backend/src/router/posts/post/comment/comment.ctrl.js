// @flow
import Joi from 'joi';
import type { Context, Middleware } from 'koa';
import db from 'database/db';
import Comment, { type WriteParams } from 'database/models/Comment';
import { validateSchema } from 'lib/common';

export const writeComment: Middleware = async (ctx: Context) => {
  type BodySchema = {
    text: string,
    replyTo: string
  };

  const schema = Joi.object().keys({
    text: Joi.string().min(1).max(1000).required(),
    replyTo: Joi.string().uuid(),
  });

  if (!validateSchema(ctx, schema)) {
    return;
  }

  const {
    text,
    replyTo,
  }: BodySchema = (ctx.request.body: any);
  const postId = ctx.post.id;
  const userId = ctx.user.id;

  try {
    const comment = await Comment.write({
      postId, userId, text, replyTo,
    });
    if (!comment) {
      ctx.status = 500;
      return;
    }
    const commentWithUsername = await Comment.readComment(comment.id);
    ctx.body = commentWithUsername;
    // TODO: edit return data type
  } catch (e) {
    ctx.throw(e);
  }
};
