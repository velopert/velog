// @flow
import type { Context } from 'koa';
import { PostLike, PostScore } from 'database/models';
import db from 'database/db';
import { TYPES } from 'database/models/PostScore';

export const getLike = async (ctx: Context): Promise<*> => {
  let liked = false;
  if (ctx.user) {
    const exists = await PostLike.checkExists({
      userId: ctx.user.id,
      postId: ctx.params.id,
    });
    liked = !!exists;
  }

  ctx.body = {
    likes: ctx.post.likes,
    liked,
  };
};

export const likePost = async (ctx: Context): Promise<*> => {
  const { id } = ctx.params;
  const { id: userId } = ctx.user;
  const { post } = ctx;
  try {
    // $FlowFixMe
    await db.transaction(async (t) => {
      const exists = await PostLike.checkExists({
        userId,
        postId: id,
      });
      if (exists) {
        ctx.status = 409;
        ctx.body = { name: 'ALREADY_LIKED' };
        return;
      }
      await PostLike.create(
        {
          fk_user_id: userId,
          fk_post_id: id,
        },
        {
          transaction: t,
        },
      );
      await post.like(t);
      await PostScore.create(
        {
          type: TYPES.LIKE,
          fk_user_id: userId,
          fk_post_id: id,
          score: 5,
        },
        {
          transaction: t,
        },
      );
      ctx.body = {
        liked: true,
        likes: post.likes,
      };
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const unlikePost = async (ctx: Context): Promise<*> => {
  const { id } = ctx.params;
  const { id: userId } = ctx.user;
  const { post } = ctx;
  try {
    // $FlowFixMe
    await db.transaction(async (t) => {
      const exists = await PostLike.checkExists({
        userId,
        postId: id,
      });
      if (!exists) {
        ctx.status = 409;
        ctx.body = { name: 'NOT_LIKED' };
        return; // ⛑ VERY STUPID MISTAKE
      }

      await exists.destroy({ transaction: t });
      await post.unlike(t);
      ctx.body = {
        liked: false,
        likes: post.likes,
      };
      const postScore = await PostScore.findOne({
        where: {
          type: TYPES.LIKE,
          fk_user_id: userId,
          fk_post_id: id,
        },
      });
      if (postScore) {
        await postScore.destroy();
      }
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};
