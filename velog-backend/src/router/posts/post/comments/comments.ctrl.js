// @flow
import Joi from 'joi';
import type { Context, Middleware } from 'koa';
import db from 'database/db';
import Comment, { type WriteParams } from 'database/models/Comment';
import { validateSchema } from 'lib/common';

export const writeComment: Middleware = async (ctx: Context) => {
  type BodySchema = {
    text: string,
    reply_to: string
  };

  const schema = Joi.object().keys({
    text: Joi.string().min(1).max(1000).required(),
    reply_to: Joi.string().uuid(),
  });

  if (!validateSchema(ctx, schema)) {
    return;
  }

  const {
    text,
    reply_to: replyTo,
  }: BodySchema = (ctx.request.body: any);

  // if user is replying to another comment,
  let level = 0;
  let processedReplyTo = replyTo;
  if (replyTo) {
    // check that it exists
    try {
      const c = await Comment.findById(replyTo, { raw: true });
      if (!c) {
        ctx.status = 404;
        ctx.body = {
          name: 'COMMENT_NOT_FOUND',
        };
        return;
      }
      level = c.level + 1;
      processedReplyTo = replyTo;
      if (level === 4) {
        level = 3; // downgrade
        processedReplyTo = c.reply_to;
      }
      // TODO: update hasReply
    } catch (e) {
      ctx.throw(500, e);
    }
  }

  const postId = ctx.post.id;
  const userId = ctx.user.id;

  try {
    const comment = await Comment.write({
      postId, userId, text, replyTo: processedReplyTo, level,
    });
    if (!comment) {
      ctx.status = 500;
      return;
    }
    const commentWithUsername = await Comment.readComment(comment.id);
    ctx.body = commentWithUsername;
  } catch (e) {
    ctx.throw(e);
  }
};


export const getCommentList: Middleware = async (ctx: Context) => {
  const postId = ctx.post.id;
  try {
    const comments = await Comment.listComments(postId);
    // TODO: re-comment * 3
    ctx.body = comments;
  } catch (e) {
    throw e;
  }
};
