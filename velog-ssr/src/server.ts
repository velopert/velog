import * as Koa from 'koa';
import * as compress from 'koa-compress';
import router from './router';
import ssr from './ssr';

class Server {
  app: Koa;
  constructor() {
    this.app = new Koa();
    this.setup();
  }
  setup() {
    this.app.use(compress({
      filter: (contentType) => {
        return /text/i.test(contentType)
      },
      threshold: 2048,
      flush: require('zlib').Z_SYNC_FLUSH
    }))
    this.app.use(router.routes()).use(router.allowedMethods());
    this.app.use(ssr);
  }
  listen(port: number) {
    this.app.listen(port);
    console.log(`Listening to port ${port}`);
  }
}

export default Server;
