// @flow
import Router from 'koa-router';
import redisClient from 'lib/redisClient';
import axios from 'axios';
import UserImage from 'database/models/UserImage';
import Sequelize from 'sequelize';

const { Op } = Sequelize;

const internal = new Router();

internal.get('/flush', async (ctx) => {
  const { INTERNAL_KEY } = process.env;
  if (ctx.query.key !== INTERNAL_KEY) {
    ctx.status = 403;
    return;
  }
  try {
    await redisClient.flushall();
    ctx.status = 204;
  } catch (e) {
    ctx.throw(500, e);
  }
});

internal.get('/check-file-size', async (ctx) => {
  try {
    const images = await UserImage.findAll({
      where: {
        filesize: null,
        created_at: {
          // $FlowFixMe
          [Op.lte]: Date.now() - 1000 * 60,
        },
      },
      limit: 50,
    });
    const responses = await Promise.all(images.map(image =>
      axios
        .head(`https://images.velog.io/${encodeURI(image.path)}`)
        .catch(e => e.response)));
    const fileSizes = responses.map(r =>
      parseInt(r.headers['content-length'], 10));
    const promises = images.map((image, i) => {
      image.filesize = fileSizes[i];
      return image.save();
    });
    await Promise.all(promises);
    ctx.body = {
      count: images.length,
    };
  } catch (e) {
    console.log(e.response);
    ctx.throw(500, e);
  }
});

export default internal;
