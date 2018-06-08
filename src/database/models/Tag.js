// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import { primaryUUID } from 'lib/common';

export type TagModel = {
  id: string,
  name: {
    type: Sequelize.STRING,
    unique: 'compositeIndex',
  }
};

const Tag = db.define('tag', {
  id: primaryUUID,
  name: Sequelize.STRING,
});

Tag.getId = async function getId(name: string) {
  try {
    let tag = await Tag.findOne({ where: { name } });
    if (!tag) {
      tag = await Tag.build({ name }).save();
    }
  } catch (e) {
    throw (e);
  }
};

export default Tag;
