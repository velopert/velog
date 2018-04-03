// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import { primaryUUID } from 'lib/common';
import { Post } from 'database/models';

const PostHistory = db.define('post_history', {
  id: primaryUUID,
  fk_post_id: Sequelize.UUID,
  title: Sequelize.STRING,
  body: Sequelize.TEXT,
  is_release: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

PostHistory.associate = function associate() {
  PostHistory.belongsTo(Post, { foreignKey: 'fk_post_id', onDelete: 'restrict', onUpdate: 'restrict' });
};

export default PostHistory;
