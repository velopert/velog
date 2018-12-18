// @flow
import type { Context } from 'koa';
import db from 'database/db';
import Sequelize from 'sequelize';
import {
  User,
  PostsTags,
  UserProfile,
  Comment,
  Post,
  PostLike,
} from 'database/models';
import { pick } from 'lodash';
import { getUserHistory } from 'database/rawQuery/users';
import { normalize, formatShortDescription } from 'lib/common';
import { type Middleware } from 'koa';

const { Op } = Sequelize;

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
      id: ctx.selectedUser.id,
      ...pick(profile, [
        'display_name',
        'short_bio',
        'thumbnail',
        'profile_links',
        'about',
      ]),
      username: ctx.params.username,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const getTags = async (ctx: Context) => {
  const { id } = ctx.selectedUser;
  const ownPost = ctx.user && ctx.user.id === id;
  try {
    const tags = await PostsTags.getPostsCount({ userId: id, ownPost });
    ctx.body = tags;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const getHistory = async (ctx: Context) => {
  const { id } = ctx.selectedUser;
  if (isNaN(ctx.query.offset || 0)) {
    ctx.body = {
      type: 'INVALID_OFFSET',
    };
    ctx.status = 400;
    return;
  }
  const offset = parseInt(ctx.query.offset || 0, 10);

  try {
    const rows = await getUserHistory(id, offset);
    // filter each types
    const commentIds = rows.filter(r => r.type === 'comment').map(r => r.id);
    const likeIds = rows.filter(r => r.type === 'like').map(r => r.id);

    // fetch each data
    const comments = await Comment.findAll({
      include: [
        {
          model: Post,
          include: [
            {
              model: User,
              include: [UserProfile],
            },
          ],
        },
      ],
      where: {
        id: {
          // $FlowFixMe
          [Op.or]: commentIds,
        },
      },
    });
    const likes = await PostLike.findAll({
      include: [
        {
          model: Post,
          include: [
            {
              model: User,
              include: [UserProfile],
            },
          ],
        },
      ],
      where: {
        id: {
          // $FlowFixMe
          [Op.or]: likeIds,
        },
      },
    });

    const serialize = row => ({
      ...pick(row, ['id', 'text']),
      post: {
        ...pick(row.post, ['title', 'url_slug', 'thumbnail', 'created_at']),
        short_description:
          row.post.meta.short_description ||
          formatShortDescription(row.post.body),
        user: {
          username: row.post.user.username,
          ...pick(row.post.user.user_profile, ['display_name', 'thumbnail']),
        },
      },
    });

    const normalized = {
      comment: normalize(comments.map(serialize), 'id'),
      like: normalize(likes.map(serialize), 'id'),
    };
    const fullData = rows.map(row => ({
      ...row,
      ...normalized[row.type].byId[row.id],
    }));
    //   fetch likeIds [post_title, url_slug]
    // rows.map(...)
    ctx.body = fullData;
  } catch (e) {
    ctx.throw(500, e);
  }
};
