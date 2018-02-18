// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import { User, Post } from 'database//models';
import { primaryUUID } from 'lib/common';

const PostLike = db.define('post_like', {
  id: primaryUUID,
  fk_post_id: Sequelize.UUID,
  fk_user_id: Sequelize.UUID,
});

PostLike.associate = function associate() {
  PostLike.belongsTo(User, { foreignKey: 'fk_user_id', onDelete: 'restrict', onUpdate: 'restrict' });
  PostLike.belongsTo(Post, { foreignKey: 'fk_post_id', onDelete: 'restrict', onUpdate: 'restrict' });
};

PostLike.checkExists = function ({ userId, postId }) {
  return PostLike.findOne({
    where: {
      fk_post_id: postId,
      fk_user_id: userId,
    },
  });
};

export default PostLike;
