// @flow
import type { Context } from 'koa';
import Joi from 'joi';
import { checkEmpty, validateSchema } from 'lib/common';
import { UserProfile, User, Post } from 'database/models';
import pick from 'lodash/pick';
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
      if (match.index !== post.index) {
        tasks.update.push({
          fk_post_id: post.id,
          index: match.index,
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
    tasks.add.forEach((a) => {
      promises.push(SeriesPosts.build({ ...a, fk_series_id: seriesId }).save());
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
  if (checkEmpty(name) || checkEmpty(description)) {
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
  try {
    const seriesList = await Series.findAll({
      limit: 20,
      include: [
        {
          model: User,
          include: [UserProfile],
        },
      ],
    });
    ctx.body = seriesList.map(serializeSeries);
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
        // Post,
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
    serialized.posts = series.posts;
    ctx.body = serialized;
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
    }
  */
};
