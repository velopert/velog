// @flow
import redis from 'redis';

class RedisClient {
  client: null | redis.RedisClient;
  connectedTime: null | number;

  constructor() {
    this.client = null;
    this.connectedTime = null;
  }
  get connected() {
    if (!this.client) return false;
    return this.client.connected;
  }
  connect() {
    const p = new Promise((resolve, reject) => {
      const { REDIS_HOST, REDIS_PASS } = process.env;
      const client = redis.createClient({
        host: process.env.REDIS_HOST || '',
        password: process.env.REDIS_PASS || '',
      });
      client.on('error', (err) => {
        console.log('Redis Error: ', err);
        reject(err);
      });
      client.on('ready', () => {
        this.connectedTime = Date.now();
        console.log('Redis is ready');
        resolve();
      });
      this.client = client;
    });
    return p;
  }
  async remove(key: string) {
    if (!this.connected || !this.client) {
      await this.connect();
    }
    if (!this.client) return;
    this.client.del(key);
    console.log('removing key %s', key);
  }
}

const redisClient = new RedisClient();

export default redisClient;
