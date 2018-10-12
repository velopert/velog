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
    const exists = await PostLike.checkExists({
      userId,
      postId: id,
    });
    if (exists) {
      ctx.status = 409;
      ctx.body = { name: 'ALREADY_LIKED' };
      return;
    }
    try {
      await PostLike.create({
        fk_user_id: userId,
        fk_post_id: id,
      });
    } catch (e) {
      ctx.status = 409;
      ctx.body = { name: 'ALREADY_LIKED' };
      return;
    }

    // count current likes
    const count = await PostLike.count({
      where: {
        fk_post_id: id,
      },
    });
    ctx.body = {
      liked: true,
      likes: count,
    };
    setTimeout(async () => {
      PostScore.create({
        type: TYPES.LIKE,
        fk_user_id: userId,
        fk_post_id: id,
        score: 5,
      });
      post.likes = count;
      post.save();
    }, 0);

    // $FlowFixMe
    // await db.transaction(async (t) => {
    //   const exists = await PostLike.checkExists({
    //     userId,
    //     postId: id,
    //   });
    //   if (exists) {
    //     ctx.status = 409;
    //     ctx.body = { name: 'ALREADY_LIKED' };
    //     return;
    //   }
    //   await PostLike.create(
    //     {
    //       fk_user_id: userId,
    //       fk_post_id: id,
    //     },
    //     {
    //       transaction: t,
    //     },
    //   );
    //   await post.like(t);
    //   await PostScore.create(
    //     {
    //       type: TYPES.LIKE,
    //       fk_user_id: userId,
    //       fk_post_id: id,
    //       score: 5,
    //     },
    //     {
    //       transaction: t,
    //     },
    //   );
    //   ctx.body = {
    //     liked: true,
    //     likes: post.likes,
    //   };
    // });
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
    const exists = await PostLike.checkExists({
      userId,
      postId: id,
    });
    if (!exists) {
      ctx.status = 409;
      ctx.body = { name: 'NOT_LIKED' };
      return;
    }

    await exists.destroy();
    const count = await PostLike.count({
      where: {
        fk_post_id: id,
      },
    });
    ctx.body = {
      liked: false,
      likes: count,
    };
    setTimeout(async () => {
      post.likes = count;
      post.save();
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
    }, 0);
  } catch (e) {
    ctx.throw(500, e);
  }
};
