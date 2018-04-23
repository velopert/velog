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

Feed.findFeedsOf = ({ userId, cursor }) => {
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
    },
  });

  return feeds;
};

Feed.associate = function associate() {
  Feed.belongsTo(User, { foreignKey: 'fk_user_id', onDelete: 'restrict', onUpdate: 'restrict' });
  Feed.belongsTo(Post, { foreignKey: 'fk_post_id', onDelete: 'restrict', onUpdate: 'restrict' });
};

export default Feed;
