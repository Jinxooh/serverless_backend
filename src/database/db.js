// @flow
import SequelizeCockroach from 'sequelize-cockroachdb';
import type Sequelize from 'sequelize';

const db:Sequelize = new SequelizeCockroach('jeckson', 'jeckson', '1234', {
  dialect: 'postgres',
  port: 26257,
  loggin: true,
  ssl: true,
  dialectOptions: {
    ssl: true,
  },
});

export default db;
