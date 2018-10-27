// @flow
import Sequelize from 'sequelize';
import pg from 'pg';

(pg: any).defaults.parseInt8 = true; // fixes issue: umbers returning as string.

const { POSTGRES_HOST, POSTGRES_USER, POSTGRES_PW } = process.env;

const db = new Sequelize('velog', POSTGRES_USER, POSTGRES_PW, {
  host: POSTGRES_HOST || '',
  dialect: 'postgres',
  define: {
    underscored: true,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export default db;
