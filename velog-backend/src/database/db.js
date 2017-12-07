// @flow
import SequelizeCockroach from 'sequelize-cockroachdb';
import type Sequelize from 'sequelize';

const db:Sequelize = new SequelizeCockroach('velog', 'velog', 'velog', {
  dialect: 'postgres',
  port: 26257,
  logging: true,
  ssl: true,
  dialectOptions: {
    ssl: true,
  },
});

export default db;
