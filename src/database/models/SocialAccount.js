// @flow
import Seqeulize from 'sequelize';
import db from 'database/db';
import User from './User';

const SocialAccount = db.define('social_profile', {
  id: {
    type: Seqeulize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  social_id: Seqeulize.STRING,
  access_token: Seqeulize.STRING,
  provider: Seqeulize.STRING,
});

SocialAccount.belongsTo(User, { foreignKey: 'fk_user_id', onDelete: 'restrict', onUpdate: 'restrict' });
SocialAccount.sync();

export default SocialAccount;

