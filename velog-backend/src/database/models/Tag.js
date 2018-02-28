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

Tag.bulkGetId = async function (names: Array<string>): Promise<*> {
  if (names.length === 0) return [];
  try {
    const tagData = await Tag.findAll({
      where: {
        name: {
          $or: names,
        },
      },
      raw: true,
    });
    // find the missing tags
    const missingTags = names.filter(name => tagData.findIndex(tag => tag.name === name) === -1);
    // create the missing tags
    const newTagIds = (await Tag.bulkCreate(missingTags.map(name => ({ name }))))
      .map(tag => tag.id);
    const tagIds = tagData.map(tag => tag.id);
    return tagIds.concat(newTagIds);
  } catch (e) {
    throw (e);
  }
};

export default Tag;
