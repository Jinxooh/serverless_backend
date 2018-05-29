// @flow
import Seqeulize from 'sequelize';
import db from 'database/db';
import User from './User';

const SocialAccount = db.define('social_profile', {
  id: {
    type: Seqeulize.UUID,
    defaultValue: Seqeulize.UUIDV1,
    primaryKey: true,
  },
  social_id: Seqeulize.STRING,
  access_token: Seqeulize.STRING,
  provider: Seqeulize.STRING,
});

SocialAccount.findUserBySocialId = function findUserBySocialId(socialId: string) {
  return SocialAccount.findOne({
    include: [User],
    where: { social_id: socialId },
  }).then(data => (data ? data.user : null));
};

SocialAccount.associate = function associate() {
  SocialAccount.belongsTo(User, { foreignKey: 'fk_user_id', onDelete: 'restrict', onUpdate: 'restrict' });
};

export default SocialAccount;

