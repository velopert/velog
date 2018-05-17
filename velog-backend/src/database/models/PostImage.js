// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import { primaryUUID } from 'lib/common';
import { Post, User } from 'database/models';

const PostImage = db.define('post_image', {
  id: primaryUUID,
  fk_post_id: Sequelize.UUID,
  fk_user_id: Sequelize.UUID,
  path: Sequelize.STRING,
  filesize: Sequelize.INTEGER,
});

PostImage.associate = function associate() {
  PostImage.belongsTo(Post, { foreignKey: 'fk_post_id', onDelete: 'CASCADE', onUpdate: 'restrict' });
  PostImage.belongsTo(User, { foreignKey: 'fk_user_id', onDelete: 'CASCADE', onUpdate: 'restrict' });
};

export default PostImage;
