// @flow
import Koa from 'koa';
import serverless from 'serverless-http';
import cors from 'lib/middlewares/cors';
import authToken from 'lib/middlewares/authToken';
import db from 'database/db';
import { associate } from 'database/sync';
import koaBody from 'koa-body';
import logger from 'koa-logger';
import router from './router';
import redisClient from './lib/redisClient';

export default class Server {
  app: Koa;

  constructor() {
    if (!redisClient.connected) {
      redisClient.connect();
    }
    associate();
    this.app = new Koa();
    this.middleware();
    this.initializeDb();
  }

  initializeDb(): void {
    db.authenticate().then(
      () => {
        console.log('DB Connection has been established');
      },
      (err) => {
        console.error('Unable to connect to the DB:', err);
      },
    );
  }

  ensureDb() {
    return new Promise((resolve, reject) => {
      let counter = 0;
      const tryConnect = async () => {
        try {
          await db.authenticate();
          resolve();
        } catch (e) {
          counter++;
          console.log(`db connection failed ${counter}`);
          if (counter > 5) {
            reject(new Error('Failed after 5 retries'));
            return;
          }
          setTimeout(tryConnect, 10);
        }
      };
      tryConnect();
    });
  }

  middleware(): void {
    const { app } = this;
    app.use(logger());
    app.use(cors);
    app.use(async (ctx, next) => {
      try {
        await this.ensureDb();
        return next();
      } catch (e) {
        ctx.throw(e);
      }
    });
    app.use(authToken);
    app.use(koaBody({
      multipart: true,
    }));
    app.use(router.routes()).use(router.allowedMethods());
  }

  listen(port: number): void {
    const { app } = this;
    app.listen(port);
    console.log('Listening to port', port);
  }

  serverless(): any {
    const { app } = this;
    return serverless(app);
  }
}
