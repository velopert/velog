import * as redis from 'redis';
import { Context } from 'koa';
import { resolve } from 'path';

class RedisClient {
  client: redis.RedisClient | null = null;
  connectedTime: number | null = null;
  get connected() {
    if (!this.client) return false;
    return this.client.connected;
  }
  connect() {
    const p = new Promise(
      (resolve, reject) => {
        const client = redis.createClient({
          host: process.env.REDIS_HOST,
          password: process.env.REDIS_PASS,
        });
        client.on('error', err => {
          console.log('Redis Error: ', err);
          reject(err);
        });
        client.on('ready', () => {
          this.connectedTime = Date.now();
          console.log('Redis is ready');
          resolve();
        });
        this.client = client;
      }
    );
    return p;
  }
  async setCache(key, value, duration) {
    if (!this.connected) {
      await this.connect();
    }
    const p = new Promise((resolve, reject) => {
      if (!this.connected || !this.client) {
        reject(new Error('redis not connected'));
        return;
      }
      this.client.set(key, value, 'EX', duration, (err, reply) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(reply);
      });
    });
    return p;
  }
  async getCache(key) {
    if (!this.connected) {
      await this.connect();
    }
    const p = new Promise((resolve, reject) => {
      this.client.get(key, (err, reply) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(reply);
      });
    });
    return p;
  }
}

const redisClient = new RedisClient();

export default redisClient;