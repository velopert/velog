// @flow
import type { Context } from 'koa';
import db from 'database/db';
import { User, PostsTags, UserProfile } from 'database/models';
import { pick } from 'lodash';

export const getUser = async (
  ctx: Context,
  next: () => Promise<*>,
): Promise<*> => {
  const { username } = ctx.params;
  try {
    const user = await User.findOne({
      where: { username },
    });
    if (!user) {
      ctx.status = 404;
      ctx.body = {
        name: 'USER_NOT_FOUND',
      };
      return;
    }
    ctx.selectedUser = user;
  } catch (e) {
    ctx.throw(500, e);
  }
  return next();
};

export const getProfile = async (ctx: Context) => {
  try {
    const profile = await ctx.selectedUser.getProfile();
    ctx.body = {
      user_id: ctx.selectedUser.id,
      ...pick(profile, ['display_name', 'short_bio', 'thumbnail']),
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const getTags = async (ctx: Context) => {
  const { id } = ctx.selectedUser;
  try {
    const tags = await PostsTags.getPostsCount({ userId: id });
    console.log(tags);
    ctx.body = tags;
  } catch (e) {
    ctx.throw(500, e);
  }
};
