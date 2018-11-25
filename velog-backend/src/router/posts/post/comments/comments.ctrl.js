// @flow
import Joi from 'joi';
import type { Context, Middleware } from 'koa';
import db from 'database/db';
import Comment, { type WriteParams } from 'database/models/Comment';
import {
  validateSchema,
  isUUID,
  checkEmpty,
  generateUnsubscribeToken,
} from 'lib/common';
import PostScore, { TYPES } from 'database/models/PostScore';
import redisClient from 'lib/redisClient';
import User from 'database/models/User';
import UserProfile from 'database/models/UserProfile';
import sendMail from 'lib/sendMail';
import marked from 'marked';
import format from 'date-fns/format';

export const writeComment: Middleware = async (ctx: Context) => {
  type BodySchema = {
    text: string,
    reply_to: string,
  };

  const schema = Joi.object().keys({
    text: Joi.string()
      .min(1)
      .max(1000)
      .required(),
    reply_to: Joi.string().uuid(),
  });

  if (!validateSchema(ctx, schema)) {
    return;
  }

  const { text, reply_to: replyTo }: BodySchema = (ctx.request.body: any);

  if (checkEmpty(text)) {
    ctx.status = 400;
    ctx.body = {
      name: 'EMPTY_COMMENT',
    };
    return;
  }

  // if (text.trim().length === 0) {
  //   ctx.status = 400;
  //   ctx.body = {
  //     name: 'EMPTY_COMMENT',
  //   };
  // }
  // if user is replying to another comment,
  let level = 0;
  let processedReplyTo = replyTo;
  if (replyTo) {
    // check that it exists
    try {
      const c = await Comment.findById(replyTo);
      if (!c) {
        ctx.status = 404;
        ctx.body = {
          name: 'COMMENT_NOT_FOUND',
        };
        return;
      }
      level = c.level + 1;
      if (level === 4) {
        level = 3; // downgrade
        processedReplyTo = c.reply_to;
      } else {
        processedReplyTo = replyTo;
        c.has_reply = true;
      }
      await c.update({
        has_replies: true,
      });
    } catch (e) {
      ctx.throw(500, e);
    }
  }

  const postId = ctx.post.id;
  const userId = ctx.user.id;
  let commentId = null;
  try {
    const comment = await Comment.write({
      postId,
      userId,
      text,
      replyTo: processedReplyTo,
      level,
    });
    commentId = comment.id;
    if (!comment) {
      ctx.status = 500;
      return;
    }
    const commentWithUsername = await Comment.readComment(comment.id);
    ctx.body = commentWithUsername;

    await PostScore.create({
      type: TYPES.COMMENT,
      fk_user_id: userId,
      fk_post_id: postId,
      score: 0.375,
    });
    const postWriter = await User.findById(ctx.post.fk_user_id);
    redisClient.remove(`/@${postWriter.username}/${ctx.post.url_slug}`);
  } catch (e) {
    ctx.throw(e);
  }

  setTimeout(async () => {
    if (ctx.post.fk_user_id === ctx.user.id) return;
    // find user
    const user = await User.findById(ctx.post.fk_user_id);
    const writerProfile = await UserProfile.findOne({
      where: { fk_user_id: ctx.user.id },
    });
    if (!user.is_certified) return;
    const postLink = `https://velog.io/@${user.username}/${ctx.post.url_slug}`;
    const unsubscribeToken = await generateUnsubscribeToken(
      ctx.user.id,
      'email_notification',
    );
    const unsubscribeUrl = `https://api.velog.io/common/email/unsubscribe?token=${unsubscribeToken}`;
    const result = await sendMail({
      to: user.email,
      subject: `Re: ${ctx.post.title}`,
      from: 'Velog <notify@velog.io>',
      body: `<a href="https://velog.io"
  ><img
    src="https://images.velog.io/email-logo.png"
    style="display: block; width: 128px; margin: 0 auto; margin-bottom: 1rem;"
/></a>
<div style="max-width: 100%; width: 600px; margin: 0 auto;">
  <div style="font-weight: 400; margin: 0; font-size: 1.25rem; color: #868e96;">
    포스트에 새 댓글이 달렸습니다.
  </div>
  <div style="margin-top: 0.5rem;">
    <a href="${postLink}" style="color: #495057; text-decoration: none"
      >${ctx.post.title}</a
    >
  </div>
  <div style="font-weight: 400; margin-top: 0.5rem; font-size: 1.75rem;"></div>
  <div
    style="width: 100%; height: 1px; background: #e9ecef; margin-top: 2rem; margin-bottom: 2rem;"
  ></div>
  <div style="display:-webkit-flex;display:-ms-flexbox;display:flex;">
    <div>
      <a href="#">
        <img
          style="height: 64px; width: 64px; display: block; border-radius: 32px;"
          src="${writerProfile.thumbnail}"
        />
      </a>
    </div>
    <div style="flex: 1; margin-left: 1.5rem; color: #495057;">
      <div style="margin-bottom: 0.5rem;">
        <a
          href="#"
          style="text-decoration: none; color: #212529; font-weight: 600;"
          >${ctx.user.username}</a
        >
      </div>
      <div style="margin: 0; color: #495057;">
        ${marked(text)}
      </div>
      <div style="font-size: 0.875rem; color: #adb5bd; margin-top: 1.5rem">
        ${format(new Date(), 'YYYY년 MM월 DD일')}
      </div>
      <a
        href="${postLink}?comment_id=${commentId || ''}"
        style="outline: none; border: none; background: #845ef7; color: white; padding-top: 0.5rem; padding-bottom: 0.5rem; font-size: 1rem; font-weight: 600; display: inline-block; background: #845ef7; padding-left: 1rem; padding-right: 1rem; align-items: center; margin-top: 1rem; border-radius: 4px; text-decoration: none;"
        >답글 달기</a
      >
    </div>
  </div>
  <div
    style="width: 100%; height: 1px; background: #e9ecef; margin-top: 4rem; margin-bottom: 1rem;"
  ></div>
  <div style="font-size: 0.875rem; color: #adb5bd; font-style: italic;">
    댓글 알림을 이메일로 수신하는 것을 원하지 않는다면 이
    <a href="${unsubscribeUrl}" style="color: inherit">링크</a>를 눌러주세요.
  </div>
</div>
`,
    });
  }, 0);
};

export const getCommentList: Middleware = async (ctx: Context) => {
  const postId = ctx.post.id;
  const { offset = 0 } = ctx.query;
  try {
    const { data, count } = await Comment.listComments({
      postId,
      offset,
    });
    const link = `<${ctx.path}?offset=${parseInt(offset, 10) +
      20}>; rel="next";`;
    if (count >= offset + 20) {
      ctx.set('Link', link);
    }
    ctx.body = data;
  } catch (e) {
    throw e;
  }
};

export const getReplies: Middleware = async (ctx: Context) => {
  const postId = ctx.post.id;
  const { commentId } = ctx.params;
  try {
    const comments = await Comment.listComments({
      postId,
      replyTo: commentId,
    });
    const link = `<${ctx.path}>; rel="next";`;
    ctx.body = comments.data;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const checkOwnComment: Middleware = async (ctx, next) => {
  const { commentId } = ctx.params;
  if (!isUUID(commentId)) {
    ctx.status = 400;
    ctx.body = {
      name: 'NOT_UUID',
    };
    return;
  }
  try {
    const comment = await Comment.findById(commentId);
    if (comment.fk_user_id !== ctx.user.id) {
      ctx.status = 403;
      ctx.body = {
        name: 'NOT_OWN_COMMENT',
      };
      return;
    }
    ctx.state.comment = comment;
    return next();
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const editComment: Middleware = async (ctx) => {
  const { comment } = ctx.state;
  if (!comment) {
    ctx.status = 500;
    return;
  }

  const schema = Joi.object().keys({
    text: Joi.string()
      .min(1)
      .max(1000)
      .required(),
  });

  if (!validateSchema(ctx, schema)) {
    return;
  }

  const { text } = (ctx.request.body: any);
  try {
    await comment.update({
      text,
    });
    const updatedComment = await Comment.readComment(comment.id);
    ctx.body = updatedComment;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const deleteComment: Middleware = async (ctx) => {
  const { comment } = ctx.state;
  if (!comment) {
    ctx.status = 500;
    return;
  }
  try {
    await comment.update({
      deleted: true,
    });
    ctx.status = 204;
  } catch (e) {
    ctx.throw(500, e);
  }
};
