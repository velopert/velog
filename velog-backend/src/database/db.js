// @flow
import SequelizeCockroach from 'sequelize-cockroachdb';
import type Sequelize from 'sequelize';

const { COCKROACHDB_HOST, COCKROACHDB_PW } = process.env;

console.log('env: ', COCKROACHDB_PW);

const db:Sequelize = new SequelizeCockroach('velog', 'velog', COCKROACHDB_PW, {
  host: COCKROACHDB_HOST,
  dialect: 'postgres',
  port: 26257,
  logging: true,
  ssl: true,
  dialectOptions: {
    ssl: true,
  },
});

export default db;
