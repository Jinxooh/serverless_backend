// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import { User } from 'database/models';
import { primaryUUID } from 'lib/common';

export type CategoryModel = {
  id: string,
  name: string,
  order: number,
  parent: string,
  private: boolean,
  fk_user_id: string,
};

const Category = db.define('category', {
  id: primaryUUID,
  name: Sequelize.STRING,
  order: Sequelize.INTEGER,
  parent: Sequelize.STRING,
  private: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  fk_user_id: Sequelize.UUID,
});

Category.associate = function associate() {
  Category.belongsTo(User, { foreignKey: 'fk_user_id', onDelete: 'restrict', onUpdate: 'restrict' });
};

export default Category;
