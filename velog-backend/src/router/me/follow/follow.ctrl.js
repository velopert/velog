// @flow
import type { Middleware, Context } from 'koa';
import User from 'database/models/User';
import FollowUser from 'database/models/FollowUser';

export const getFollows: Middleware = async (ctx: Context) => {

};

export const getFollowUserStatus: Middleware = async (ctx: Context) => {
  const { id: userId } = ctx.user;
  const followUserId = ctx.params.id;
  
  try {

  } catch (e) {
    
  }
};

export const followUser: Middleware = async (ctx: Context) => {
  const { id: userId } = ctx.user;
  const followUserId = ctx.params.id;

  if (followUserId.toString() === userId.toString()) {
    ctx.status = 400;
    ctx.body = {
      name: 'CANNOT_FOLLOW_YOURSELF',
    };
    return;
  }

  // check whether the user exists
  try {
    // check whether the user exists
    const userToFollow = await User.findById(followUserId);
    if (!userToFollow) {
      ctx.status = 404;
      ctx.body = {
        name: 'USER_NOT_FOUND',
      };
      return;
    }

    // check follow info already exists
    const exists = await FollowUser.findOne({
      where: {
        fk_user_id: userId,
        fk_follow_user_id: followUserId,
      },
    });

    if (exists) {
      ctx.status = 409;
      ctx.body = {
        name: 'ALREADY_FOLLOWED',
      };
      return;
    }

    // create data
    const followUserData = await FollowUser.build({
      fk_user_id: userId,
      fk_follow_user_id: followUserId,
    }).save();

    ctx.body = {
      id: followUserData.id,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const followTag: Middleware = async (ctx: Context) => {

};

export const deleteFollowUser: Middleware = async (ctx: Context) => {

};

export const deleteFollowTag: Middleware = async (ctx: Context) => {

};

