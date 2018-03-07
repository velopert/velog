// @flow
import type { Context } from 'koa';
import { PostLike } from 'database/models';

export const getLike = async (ctx: Context): Promise<*> => {
  ctx.body = {
    likes: ctx.post.likes,
  };
};

export const likePost = async (ctx: Context): Promise<*> => {
  const { id } = ctx.params;
  const { id: userId } = ctx.user;

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

    await PostLike.build({
      fk_user_id: userId,
      fk_post_id: id,
    }).save();
    const { post } = ctx;
    await post.like();
    ctx.body = {
      likes: post.likes,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const unlikePost = async (ctx: Context): Promise<*> => {
  const { id } = ctx.params;
  const { id: userId } = ctx.user;

  try {
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
    const { post } = ctx;
    await post.unlike();
    ctx.body = {
      likes: post.likes,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};
