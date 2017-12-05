// @flow
import Koa from 'koa';
import serverless from 'serverless-http';
import router from './router';

export default class Server {
  app: Koa;

  constructor() {
    this.app = new Koa();
    this.middleware();
  }

  middleware(): void {
    const { app } = this;
    app.use(router.routes())
      .use(router.allowedMethods());
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
