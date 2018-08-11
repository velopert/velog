// @flow
import Koa from 'koa';
import serverless from 'serverless-http';
import cors from 'lib/middlewares/cors';
import authToken from 'lib/middlewares/authToken';
import db from 'database/db';
import { associate } from 'database/sync';
import koaBody from 'koa-body';
import router from './router';
import redisClient from './lib/redisClient';

export default class Server {
  app: Koa;

  constructor() {
    if (!redisClient.connected) {
      redisClient.connect();
    }
    this.app = new Koa();
    this.middleware();
    this.initializeDb();
  }

  initializeDb(): void {
    db.authenticate().then(
      () => {
        associate();
        console.log('DB Connection has been established');
      },
      (err) => {
        console.error('Unable to connect to the DB:', err);
      },
    );
  }

  middleware(): void {
    const { app } = this;
    app.use(cors);
    app.use(authToken);
    app.use(koaBody({
      multipart: true,
    }));
    app.use(router.routes()).use(router.allowedMethods());
    app.use((ctx) => {
      ctx.body = ctx.path;
    });
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
