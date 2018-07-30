import * as Koa from 'koa';
import router from './router';

class Server {
  app: Koa;
  constructor() {
    this.app = new Koa();
    this.setup();
  }
  setup() {
    this.app.use(router.routes()).use(router.allowedMethods());
  }
  listen(port: number) {
    this.app.listen(port);
    console.log(`Listening to port ${port}`);
  }
}

export default Server;
