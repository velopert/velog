// @flow
import type { Context } from 'koa';
import { PostLike } from 'database/models';
import db from 'database/db';

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
  // $FlowFixMe
  const result = await db.transaction((t) => {
    return PostLike.checkExists({
      userId,
      postId: id,
    }).then((exists) => {
      if (exists) {
        ctx.status = 409;
        ctx.body = { name: 'ALREADY_LIKED' };
        return;
      }
      return PostLike.create({
        fk_user_id: userId,
        fk_post_id: id,
      }, {
        transaction: t,
      }).then(() => {
        return post.like(t)
          .then(() => {
            ctx.body = {
              liked: true,
              likes: post.likes,
            };
          });
      });
    });
  });

/*
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
      liked: true,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
*/
};

export const unlikePost = async (ctx: Context): Promise<*> => {
  const { id } = ctx.params;
  const { id: userId } = ctx.user;
  const { post } = ctx;
  // $FlowFixMe
  const result = await db.transaction((t) => {
    return PostLike.checkExists({
      userId,
      postId: id,
    }).then((exists) => {
      if (!exists) {
        ctx.status = 409;
        ctx.body = { name: 'NOT_LIKED' };
        return; // ⛑ VERY STUPID MISTAKE
      }
      return exists.destroy({ transaction: t })
        .then(() => {
          return post.unlike(t);
        })
        .then(() => {
          ctx.body = {
            liked: false,
            likes: post.likes,
          };
        });
    });
  });
/*
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
      liked: false,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
*/
};
