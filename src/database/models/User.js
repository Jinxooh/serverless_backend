// @flow
import Seqeulize from 'sequelize';
import bcrypt from 'bcrypt';
import db from 'database/db';

const UserModel = db.define('user', {
  id: {
    type: Seqeulize.UUID,
    defaultValue: Seqeulize.UUIDV1,
    primaryKey: true,
  },
  username: {
    type: Seqeulize.STRING,
    unique: true,
  },
  email: {
    type: Seqeulize.STRING,
    unique: true,
  },
  password_hash: {
    type: Seqeulize.STRING,
  },
});

UserModel.sync();

export default class User extends UserModel {
  static crypt(password: string): Promise<string> {
    const saltRounds: number = 10;
    return bcrypt.hash(password, saltRounds);
  }
};
