// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import { primaryUUID } from 'lib/common';
import { User, Post, Tag, Category } from 'database/models';

const Feed = db.define(
  'feed',
  {
    id: primaryUUID,
    fk_post_id: Sequelize.UUID,
    fk_user_id: Sequelize.UUID,
    reason: Sequelize.JSONB,
    score: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    },
  },
  {
    indexes: [
      {
        fields: ['created_at'],
      },
    ],
  },
);

Feed.findFeedsOf = async ({ userId, cursor }) => {
  let cursorData = null;
  try {
    if (cursor) {
      cursorData = await Feed.findOne({
        where: {
          id: cursor,
        },
      });
      if (!cursorData) {
        const e = new Error('Cursor data is not found');
        e.name = 'CURSOR_NOT_FOUND';
        throw e;
      }
    }
  } catch (e) {
    throw e;
  }
  const feeds = Feed.findAll({
    include: [
      {
        model: Post,
        include: [
          {
            model: User,
            attributes: ['username'],
          },
          Tag,
          Category,
        ],
      },
    ],
    where: {
      fk_user_id: userId,
      ...(cursor
        ? {
          id: { $not: cursor },
          created_at: { $lte: cursorData && cursorData.created_at },
        }
        : {}),
    },
    order: [['created_at', 'DESC']],
    limit: 20,
  });

  return feeds;
};

Feed.associate = function associate() {
  Feed.belongsTo(User, { foreignKey: 'fk_user_id', onDelete: 'CASCADE', onUpdate: 'restrict' });
  Feed.belongsTo(Post, { foreignKey: 'fk_post_id', onDelete: 'CASCADE', onUpdate: 'restrict' });
};

export default Feed;
