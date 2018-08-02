import * as Koa from 'koa';
import router from './router';
import ssr from './ssr';

class Server {
  app: Koa;
  constructor() {
    this.app = new Koa();
    this.setup();
  }
  setup() {
    this.app.use(router.routes()).use(router.allowedMethods());
    this.app.use(ssr);
  }
  listen(port: number) {
    this.app.listen(port);
    console.log(`Listening to port ${port}`);
  }
}

export default Server;
