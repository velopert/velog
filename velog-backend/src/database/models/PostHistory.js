// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import { primaryUUID } from 'lib/common';
import { User, Post } from 'database/models';

const PostHistory = db.define('post_history', {
  id: primaryUUID,
  fk_original_post_id: Sequelize.UUID,
  title: Sequelize.STRING,
  body: Sequelize.TEXT,
});

PostHistory.associate = function associate() {
  PostHistory.belongsTo(Post, { foreignKey: 'fk_original_post_id', onDelete: 'restrict', onUpdate: 'restrict' });
};

export default PostHistory;
