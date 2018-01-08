// @flow
import Seqeulize from 'sequelize';
import db from 'database/db';

const User = db.define('user', {
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

User.sync();

export default User;

