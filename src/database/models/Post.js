// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import { User } from 'database/models';
import { primaryUUID } from 'lib/common';

export type PostModel = {
  id: string,
  title: string,
  body: string,
  short_description: string,
  thumbnail: string,
  is_markdown: boolean,
  is_temp: boolean,
  meta_json: string,
}

const Post = db.define('post', {
  id: primaryUUID,
  title: Sequelize.STRING,
  body: Sequelize.TEXT,
  short_description: Sequelize.STRING,
  thumbnail: Sequelize.STRING,
  is_markdown: Sequelize.BOOLEAN,
  is_temp: Sequelize.BOOLEAN,
  meta_json: Sequelize.TEXT,
  fk_user_id: Sequelize.UUID,
  original_post_id: Sequelize.UUID,
  url_slug: Sequelize.STRING,
}, {
  indexes: [
    {
      fields: ['url_slug'],
    },
  ],
});

Post.associate = function associate() {
  Post.belongsTo(User, { foreignKey: 'fk_user_id', onDelete: 'restrict', onUpdate: 'restrict' });
};

export default Post;
