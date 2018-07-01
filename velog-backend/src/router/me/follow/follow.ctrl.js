// @flow
import type { Middleware, Context } from 'koa';
import User from 'database/models/User';
import FollowUser from 'database/models/FollowUser';
import Tag from 'database/models/Tag';
import FollowTag from 'database/models/FollowTag';

export const getFollows: Middleware = async (ctx: Context) => {
  const { id: userId } = ctx.user;
  const type = ctx.query.type || 'all'; // default value is all

  try {
    let tagList = null;
    let userList = null;

    if (['all', 'user'].includes(type)) {
      userList = await FollowUser.getListOfUser(userId);
    }
    if (['all', 'tag'].includes(type)) {
      tagList = await FollowTag.getListOfUser(userId);
    }

    if (type === 'user') {
      ctx.body = {
        list: userList && userList.map(FollowUser.serialize),
      };
      return;
    }

    if (type === 'tag') {
      ctx.body = {
        list: tagList && tagList.map(FollowTag.serialize),
      };
      return;
    }

    ctx.body = {
      follow_user_list: userList && userList.map(FollowUser.serialize),
      follow_tag_list: tagList && tagList.map(FollowTag.serialize),
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const getFollowUserStatus: Middleware = async (ctx: Context) => {
  const { id: userId } = ctx.user;
  const followUserId = ctx.params.id;

  try {
    const exists = await FollowUser.findOne({
      where: {
        fk_user_id: userId,
        fk_follow_user_id: followUserId,
      },
    });

    ctx.body = {
      following: !!exists,
    };
  } catch (e) {
    ctx.throw(500, e);
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

    ctx.status = 204;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const unfollowUser: Middleware = async (ctx: Context) => {
  const { id: userId } = ctx.user;
  const followUserId = ctx.params.id;

  try {
    // check follow existancy
    const follow = await FollowUser.findOne({
      where: {
        fk_user_id: userId,
        fk_follow_user_id: followUserId,
      },
    });
    if (!follow) {
      ctx.body = {
        name: 'NOT_FOLLOWING',
      };
      ctx.status = 409;
      return;
    }
    await follow.destroy();
    ctx.status = 204;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const getFollowTagStatus: Middleware = async (ctx: Context) => {
  const { id: userId } = ctx.user;
  const tagId = ctx.params.id;

  try {
    const exists = await FollowTag.findOne({
      where: {
        fk_user_id: userId,
        fk_tag_id: tagId,
      },
    });

    ctx.body = {
      following: !!exists,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const followTag: Middleware = async (ctx: Context) => {
  const { id: userId } = ctx.user;
  const tagId = ctx.params.id;

  // check whether the tag exists
  try {
    // check whether the user exists
    const tagToFollow = await Tag.findById(tagId);
    if (!tagToFollow) {
      ctx.status = 404;
      ctx.body = {
        name: 'TAG_NOT_FOUND',
      };
      return;
    }

    // check follow info already exists
    const exists = await FollowTag.findOne({
      where: {
        fk_user_id: userId,
        fk_tag_id: tagId,
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
    const followTagData = await FollowTag.build({
      fk_user_id: userId,
      fk_tag_id: tagId,
    }).save();

    ctx.status = 204;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const deleteFollowTag: Middleware = async (ctx: Context) => {};
