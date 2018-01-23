// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import { primaryUUID } from 'lib/common';

export type TagModel = {
  id: string,
  name: string
};

const Tag = db.define('tag', {
  id: primaryUUID,
  name: {
    type: Sequelize.STRING,
    unique: 'compositeIndex',
  },
});

// gets tag id if exists, creates one if !exists.
Tag.getId = async function getId(name: string) {
  try {
    let tag = await Tag.findOne({ where: { name } });
    if (!tag) {
      tag = await Tag.build({ name }).save();
    }
    return tag.id;
  } catch (e) {
    throw (e);
  }
};

export default Tag;
