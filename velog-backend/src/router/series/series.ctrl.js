// @flow
import type { Context } from 'koa';
import Joi from 'joi';
import {
  checkEmpty,
  validateSchema,
  isUUID,
  formatShortDescription,
} from 'lib/common';
import { UserProfile, User, Post } from 'database/models';
import pick from 'lodash/pick';
import { getSeriesPostCountList } from 'database/rawQuery/series';
import SeriesPosts from '../../database/models/SeriesPosts';
import Series, { serializeSeries } from '../../database/models/Series';

const seriesPostSchema = Joi.object().keys({
  id: Joi.string().required(),
  index: Joi.number().required(),
});
const seriesSchema = Joi.object().keys({
  name: Joi.string()
    .trim()
    .min(1)
    .max(120),
  description: Joi.string()
    .required()
    .allow(''),
  url_slug: Joi.string()
    .trim()
    .min(1)
    .max(40),
  posts: Joi.array()
    .items(seriesPostSchema)
    .required(),
  thumbnail: Joi.string().allow(null),
});

type SeriesPostInfo = {
  fk_post_id: string,
  index: number,
};

async function updateSeriesPosts(seriesId: string, posts: SeriesPostInfo[]) {
  try {
    const prevPosts = await SeriesPosts.findAll({
      where: {
        fk_series_id: seriesId,
      },
    });

    const tasks = {
      add: [],
      update: [],
      remove: [],
    };

    const convertToMap = (data) => {
      const map = {};
      data.forEach((d) => {
        map[d.fk_post_id] = d.index;
      });
      return map;
    };

    const prevPostsMap = convertToMap(prevPosts);
    const postsMap = convertToMap(posts);

    prevPosts.forEach((post) => {
      const match = postsMap[post.fk_post_id];
      if (!match) {
        tasks.remove.push(post);
      }
      if (match !== post.index) {
        tasks.update.push({
          id: post.id,
          index: match,
        });
      }
    });
    posts.forEach((post) => {
      const match = prevPostsMap[post.fk_post_id];
      if (!match) {
        tasks.add.push(post);
      }
    });

    const promises = [];
    tasks.add.forEach((t) => {
      promises.push(SeriesPosts.build({ ...t, fk_series_id: seriesId }).save());
    });
    tasks.update.forEach((t) => {
      promises.push(SeriesPosts.update(
        { index: t.index },
        {
          where: {
            id: t.id,
          },
        },
      ));
    });
    tasks.remove.forEach((t) => {
      promises.push(t.destroy());
    });
    await Promise.all(promises);
  } catch (e) {
    throw e;
  }
  // 1. get current posts of seriesId
  // 2. diff new -> current
  // - detect new items to add
  // 3. diff current -> new
  // - detect items to update
  // - detect items to remove
}

export const createSeries = async (ctx: Context) => {
  /*
    Request Body
    {
      name,
      description,
      url_slug,
      posts?: [],
      thumbnail,
    }
  */
  if (!validateSchema(ctx, seriesSchema)) {
    return;
  }
  const {
    name, description, url_slug, posts, thumbnail,
  } = (ctx.request
    .body: any);
  if (checkEmpty(name)) {
    ctx.status = 400;
    ctx.body = {
      name: 'EMPTY_FIELD',
    };
    return;
  }

  // check url_slug duplicates
  try {
    const exists = await Series.findOne({
      where: {
        fk_user_id: ctx.user.id,
        url_slug,
      },
    });
    if (exists) {
      ctx.status = 409;
      ctx.body = {
        name: 'URL_EXISTS',
      };
      return;
    }
    const series = await Series.build({
      name,
      description,
      url_slug,
      fk_user_id: ctx.user.id,
    }).save();

    await updateSeriesPosts(
      series.id,
      posts.map(p => ({ fk_post_id: p.id, index: p.index })),
    );
    ctx.body = {
      id: series.id,
      name,
      description,
      url_slug,
      thumbnail,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};
export const listSeries = async (ctx: Context) => {
  const { username } = ctx.params;
  try {
    const seriesList = await Series.findAll({
      // limit: 20,
      include: [
        {
          model: User,
          include: [UserProfile],
          ...(username
            ? {
              where: {
                username,
              },
            }
            : {}),
        },
      ],
      order: [['updated_at', 'DESC']],
    });
    if (seriesList.length === 0) {
      ctx.body = [];
      return;
    }
    const counts = await getSeriesPostCountList(seriesList.map(series => series.id));
    const flatData = {};
    counts.forEach((c) => {
      flatData[c.id] = c.count;
    });
    const serialized = seriesList.map(serializeSeries);
    serialized.forEach((s) => {
      s.posts_count = flatData[s.id];
    });
    ctx.body = serialized;
  } catch (e) {
    ctx.throw(500, e);
  }
};
export const getSeries = async (ctx: Context) => {
  const { urlSlug, username } = ctx.params;
  try {
    const series = await Series.findOne({
      include: [
        {
          model: User,
          include: [UserProfile],
          where: {
            username,
          },
        },
      ],
      where: {
        url_slug: urlSlug,
      },
    });
    if (!series) {
      ctx.status = 404;
      return;
    }
    const serialized = serializeSeries(series);
    const seriesPosts = await SeriesPosts.findAll({
      where: {
        fk_series_id: series.id,
      },
      include: [Post],
      order: [['index', 'ASC']],
    });
    serialized.posts = seriesPosts.map(p => ({
      index: p.index,
      ...pick(p.post, [
        'id',
        'thumbnail',
        'title',
        'released_at',
        'meta',
        'url_slug',
      ]),
      body: formatShortDescription(p.post.body),
    }));
    ctx.body = serialized;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const getSeriesMiddleware = async (
  ctx: Context,
  next: () => Promise<*>,
) => {
  try {
    const series = await Series.findOne({
      include: [
        {
          model: User,
          include: [UserProfile],
          where: {
            username: ctx.params.username,
          },
        },
      ],
      where: {
        url_slug: ctx.params.urlSlug,
      },
    });
    if (!series) {
      ctx.status = 404;
      return;
    }
    ctx.state.series = series;
    return next();
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const updateSeries = async (ctx: Context) => {
  /*
    Request Body
    {
      name,
      description,
      url_slug,
      posts?: [],
      thumbnail,
    }
  */
  if (!validateSchema(ctx, seriesSchema)) {
    return;
  }

  if (!ctx.user) {
    ctx.status = 401;
    return;
  }
  const {
    name, description, url_slug, posts, thumbnail,
  } = (ctx.request
    .body: any);
  if (checkEmpty(name)) {
    ctx.status = 400;
    ctx.body = {
      name: 'EMPTY_FIELD',
    };
    return;
  }

  // check url_slug duplicates
  const { series } = ctx.state;

  if (series.fk_user_id !== ctx.user.id) {
    ctx.status = 403;
    return;
  }

  try {
    if (url_slug !== series.url_slug) {
      // check duplicates
      const exists = await Series.findOne({
        include: [
          {
            model: User,
            include: [UserProfile],
            where: {
              username: ctx.params.username,
            },
          },
        ],
        where: {
          url_slug,
        },
      });

      if (exists) {
        ctx.status = 409;
        ctx.body = {
          name: 'URL_EXISTS',
        };
        return;
      }
    }

    await series.update({
      name,
      description,
      url_slug,
      thumbnail,
    });

    await updateSeriesPosts(
      series.id,
      posts.map(p => ({ fk_post_id: p.id, index: p.index })),
    );
    ctx.body = {
      id: series.id,
      name,
      description,
      url_slug,
      thumbnail,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const deleteSeries = async (ctx: Context) => {
  const { series } = ctx.state;
  if (!ctx.user) {
    ctx.status = 401;
    return;
  }
  try {
    if (!series) {
      ctx.status = 404;
      return;
    }
    if (series.fk_user_id !== ctx.user.id) {
      ctx.status = 403;
      return;
    }
    await series.destroy();
    ctx.status = 204;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const appendToSeries = async (ctx: Context) => {
  const { series } = ctx.state;
  try {
    // valid id
    const { id } = (ctx.request.body: any);
    if (!isUUID(id)) {
      ctx.status = 400;
      ctx.body = {
        name: 'NOT_UUID',
      };
      return;
    }
    // find post
    const post = await Post.findById(id);
    if (!post) {
      ctx.status = 404;
      ctx.body = {
        name: 'POST_NOT_FOUND',
      };
      return;
    }
    // check user
    if (post.fk_user_id !== series.fk_user_id) {
      ctx.status = 403;
      ctx.body = [post.fk_user_id, series.fk_user_id];
      return;
    }
    // list all series post
    const seriesPosts = await SeriesPosts.findAll({
      where: {
        fk_series_id: series.id,
      },
      include: [Post],
      order: [['index', 'ASC']],
    });
    const nextIndex =
      seriesPosts.length === 0
        ? 1
        : seriesPosts[seriesPosts.length - 1].index + 1;
    // check already added
    const exists = seriesPosts.find(sp => sp.fk_post_id === id);
    if (exists) {
      ctx.status = 409;
      ctx.body = {
        name: 'ALREADY_EXISTS',
      };
      return;
    }
    const sp = await SeriesPosts.build({
      fk_user_id: series.fk_user_id,
      index: nextIndex,
      fk_post_id: id,
      fk_series_id: series.id,
    }).save();
    ctx.body = sp;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
Executing (default): UPDATE "series_posts" SET "index"=4,"updated_at"='2018-12-26 14:49:01.724 +00:00' WHERE "fk_series_id" = 'c58a96d0-0918-11e9-a144-d18fee4fc68f' AND "fk_post_id" = 'c58e8e70-0918-11e9-a144-d18fee4fc68f'
Executing (default): UPDATE "series_posts" SET "index"=3,"updated_at"='2018-12-26 14:49:01.726 +00:00' WHERE "fk_series_id" = 'c58a96d0-0918-11e9-a144-d18fee4fc68f' AND "fk_post_id" = '1c3461c0-091c-11e9-99ef-cb07d185eb21'
*/
