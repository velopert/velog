import * as Koa from 'koa';
import * as compress from 'koa-compress';
import router from './router';
import ssr from './ssr';
import redisClient from './lib/redisClient';

class Server {
  app: Koa;
  constructor() {
    this.app = new Koa();
    this.setup();
  }
  async setup() {
    // connect redis
    if (!redisClient.connected) {
      redisClient.connect();
    } else {
      console.log('reusing redis connection...');
    }
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
