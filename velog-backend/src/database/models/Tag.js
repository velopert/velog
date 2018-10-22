// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import { primaryUUID } from 'lib/common';

export type TagModel = {
  id: string,
  name: string,
};

const Tag = db.define('tag', {
  id: primaryUUID,
  name: {
    type: Sequelize.STRING,
    unique: 'compositeIndex',
  },
});

Tag.findByName = async (name: string) => {
  return Tag.findOne({
    where: {
      // $FlowFixMe
      [Sequelize.Op.or]: [
        Sequelize.where(
          Sequelize.fn('lower', Sequelize.col('name')),
          Sequelize.fn('lower', name),
        ),
        Sequelize.where(
          Sequelize.fn(
            'replace',
            Sequelize.fn('lower', Sequelize.col('name')),
            ' ',
            '-',
          ),
          Sequelize.fn('replace', Sequelize.fn('lower', name), ' ', '-'),
        ),
      ],
    },
  });
};

// gets tag id if exists, creates one if !exists.
Tag.getId = async function getId(rawName: string) {
  const name = rawName.trim();
  try {
    // let tag = await Tag.findOne({ where: { name } });
    let tag = await Tag.findOne({
      where: {
        // $FlowFixMe
        [Sequelize.Op.or]: [
          Sequelize.where(
            Sequelize.fn('lower', Sequelize.col('name')),
            Sequelize.fn('lower', name),
          ),
          Sequelize.where(
            Sequelize.fn(
              'replace',
              Sequelize.fn('lower', Sequelize.col('name')),
              ' ',
              '-',
            ),
            Sequelize.fn('replace', Sequelize.fn('lower', name), ' ', '-'),
          ),
        ],
      },
    });
    if (!tag) {
      tag = await Tag.build({ name }).save();
    }
    return tag.id;
  } catch (e) {
    throw e;
  }
};

Tag.bulkGetId = async function (rawNames: Array<string>): Promise<*> {
  try {
    const tags = await Promise.all(rawNames.map(name => Tag.getId(name)));
    return tags;
  } catch (e) {
    throw e;
  }
  // Comment the whole code due to tag duplication
  // To be optimized later on..
  // const names = rawNames.map(r => r.trim());
  // if (names.length === 0) return [];
  // try {
  //   const tagData = await Tag.findAll({
  //     where: {
  //       name: {
  //         $or: names,
  //       },
  //     },
  //     raw: true,
  //   });
  //   // find the missing tags
  //   const missingTags = names.filter(name => tagData.findIndex(tag => tag.name === name) === -1);
  //   // create the missing tags
  //   const newTagIds = (await Tag.bulkCreate(missingTags.map(name => ({ name })))).map(tag => tag.id);
  //   const tagIds = tagData.map(tag => tag.id);
  //   return tagIds.concat(newTagIds);
  // } catch (e) {
  //   throw e;
  // }
};

export default Tag;
