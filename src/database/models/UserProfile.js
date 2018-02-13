// @flow
import Seqeulize from 'sequelize';
import db from 'database/db';
import User from './User';

export interface UserProfileModel {
  id: number,
  display_name: string,
  short_bio: string,
  thumbnail: string,
}

const UserProfile = db.define('user_profile', {
  id: {
    type: Seqeulize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  display_name: Seqeulize.STRING,
  short_bio: Seqeulize.STRING,
  thumbnail: Seqeulize.STRING,
});

UserProfile.belongsTo(User, { foreignKey: 'fk_user_id', onDelete: 'restrict', onUpdate: 'restrict' });
UserProfile.sync();

export default UserProfile;

