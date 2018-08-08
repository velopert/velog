import * as redis from 'redis';
import { Context } from 'koa';

class RedisClient {
  client: redis.RedisClient | null = null;
  get connected() {
    return this.client.connected;
  }
  connect() {
    const client = redis.createClient({
  
    });
    client.on('error', err => {
      console.log('Redis Error: ', err);
    });
    client.on('ready', () => {
      console.log('Redis is ready');
    });
    this.client = client;
  }
}

const redisClient = new RedisClient();

export default redisClient;