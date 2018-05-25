// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import { primaryUUID } from 'lib/common';
import { Category, Post } from 'database/models';

/* N:M Relationship between Posts and Categories */
const PostsCategories = db.defines('posts_categories', {
  id: primaryUUID,
  fk_post_id: Sequelize.UUID,
  fk_category_id: Sequelize.UUID,
});

PostsCategories.associate = function associate() {
  Post.belongsToMany(Category, {
    onDelete: 'restrict',
    onUpdate: 'restrict',
    through: {
      model: PostsCategories,
    },
    foreignKey: 'fk_post_id',
  });
  Category.belongsToMany(Post, {
    onDelete: 'restrict',
    onUpdate: 'restrict',
    through: {
      model: PostsCategories,
    },
    foreignKey: 'fk_category_id',
  });
};

export default PostsCategories;
