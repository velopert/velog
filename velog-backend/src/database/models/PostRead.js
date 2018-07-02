// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import { primaryUUID } from 'lib/common';
import { Post, User } from 'database/models';

const PostRead = db.define(
  'post_read',
  {
    id: primaryUUID,
    ip_hash: Sequelize.STRING,
    fk_user_id: Sequelize.UUID,
    fk_post_id: Sequelize.UUID,
  },
  {
    indexes: [
      {
        fields: ['ip_hash', 'fk_post_id'],
      },
      {
        fields: ['created_at'],
      },
    ],
  },
);

PostRead.associate = () => {
  PostRead.belongsTo(User, {
    foreignKey: 'fk_user_id',
    onDelete: 'CASCADE',
    onUpdate: 'restrict',
  });
  PostRead.belongsTo(Post, {
    foreignKey: 'fk_post_id',
    onDelete: 'CASCADE',
    onUpdate: 'restrict',
  });
};

PostRead.countByPostId = (postId: string, transaction: any) => {
  return PostRead.count(
    {
      where: {
        fk_post_id: postId,
      },
    },
    {
      transaction,
    },
  );
};

export default PostRead;
