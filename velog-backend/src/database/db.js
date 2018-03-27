// @flow
import SequelizeCockroach from 'sequelize-cockroachdb';
import type Sequelize from 'sequelize';
import pg from 'pg';

pg.defaults.parseInt8 = true; // fixes issue: umbers returning as string.


const { COCKROACHDB_HOST, COCKROACHDB_PW } = process.env;
const db:Sequelize = new SequelizeCockroach('velog', 'velog', COCKROACHDB_PW, {
  host: COCKROACHDB_HOST,
  dialect: 'postgres',
  port: 26257,
  logging: true,
  ssl: true,
  dialectOptions: {
    ssl: true,
    supportBigNumbers: true,
  },
  define: {
    underscored: true,
  },
});

export default db;
