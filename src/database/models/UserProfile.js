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
    type: Seqeulize.UUID,
    defaultValue: Seqeulize.UUIDV1,
    primaryKey: true,
  },
  display_name: Seqeulize.STRING,
  short_bio: Seqeulize.STRING,
  thumbnail: Seqeulize.STRING,
});

UserProfile.associate = function associate() {
  UserProfile.belongsTo(User, { foreignKey: 'fk_user_id', onDelete: 'restrict', onUpdate: 'restrict' });
};

UserProfile.findByUserId = function findByUserId(userId: string) {
  return this.findOne({
    where: {
      fk_user_id: userId,
    },
  });
};

export default UserProfile;

