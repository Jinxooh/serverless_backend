// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import shortid from 'shortid';

export interface EmailVerifiacationModel {
  id: number,
  code: string,
  email: string,
  createdAt: string,
}

const EmailVerifiacation = db.define('email_verification', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  code: {
    type: Sequelize.STRING,
    unique: true,
    defaultVlaue: shortid.generate,
  },
  email: Sequelize.STRING,
});

EmailVerifiacation.sync();

export default EmailVerifiacation;
