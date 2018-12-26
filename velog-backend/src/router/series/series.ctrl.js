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
      ...pick(p.post, ['id', 'thumbnail', 'title', 'released_at']),
    }));
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

/*
Executing (default): UPDATE "series_posts" SET "index"=4,"updated_at"='2018-12-26 14:49:01.724 +00:00' WHERE "fk_series_id" = 'c58a96d0-0918-11e9-a144-d18fee4fc68f' AND "fk_post_id" = 'c58e8e70-0918-11e9-a144-d18fee4fc68f'
Executing (default): UPDATE "series_posts" SET "index"=3,"updated_at"='2018-12-26 14:49:01.726 +00:00' WHERE "fk_series_id" = 'c58a96d0-0918-11e9-a144-d18fee4fc68f' AND "fk_post_id" = '1c3461c0-091c-11e9-99ef-cb07d185eb21'
*/
