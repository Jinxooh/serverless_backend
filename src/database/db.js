// @flow
import SequelizeCockroach from 'sequelize-cockroachdb';
import type Sequelize from 'sequelize';

const { COCKROACHDB_HOST, COCKROACHDB_PW } = process.env;
const db:Sequelize = new SequelizeCockroach('jeckson', 'jeckson', COCKROACHDB_PW, {
  host: COCKROACHDB_HOST,
  dialect: 'postgres',
  port: 26257,
  loggin: true,
  ssl: true,
  dialectOptions: {
    ssl: true,
  },
});

export default db;
