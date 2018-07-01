// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import { primaryUUID } from 'lib/common';
import { Post, User } from 'database/models';

export const TYPES = {
  LIKE: 'LIKE',
  COMMENT: 'COMMENT',
  READ: 'READ',
};

const PostScore = db.define('post_score', {
  id: primaryUUID,
  type: Sequelize.STRING,
  fk_user_id: Sequelize.UUID,
  fk_post_id: Sequelize.UUID,
  score: {
    type: Sequelize.FLOAT,
    defaultValue: 0,
  },
});

PostScore.associate = () => {
  PostScore.belongsTo(Post, {
    foreignKey: 'fk_post_id',
    onDelete: 'CASCADE',
    onUpdate: 'restrict',
  });
  PostScore.belongsTo(User, {
    foreignKey: 'fk_user_id',
    onDelete: 'CASCADE',
    onUpdate: 'restrict',
  });
};

export default PostScore;
