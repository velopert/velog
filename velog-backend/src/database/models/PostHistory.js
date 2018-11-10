// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import { primaryUUID } from 'lib/common';
import { Post } from 'database/models';

const PostHistory = db.define(
  'post_history',
  {
    id: primaryUUID,
    fk_post_id: Sequelize.UUID,
    title: Sequelize.STRING,
    body: Sequelize.TEXT,
    is_release: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    indexes: [
      {
        fields: ['created_at'],
      },
      {
        fields: ['fk_post_id'],
      },
    ],
  },
);

PostHistory.associate = function associate() {
  PostHistory.belongsTo(Post, {
    foreignKey: 'fk_post_id',
    onDelete: 'CASCADE',
    onUpdate: 'restrict',
  });
};

PostHistory.list = function list(postId, page = 1) {
  return PostHistory.findAll({
    where: {
      fk_post_id: postId,
    },
    order: [['created_at', 'DESC']],
    limit: 10,
    offset: (page - 1) * 10,
  });
};

PostHistory.countTempSaves = function countTempSaves(postId) {
  return PostHistory.count({
    where: {
      fk_post_id: postId,
    },
  });
};

export default PostHistory;
