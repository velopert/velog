// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import { primaryUUID } from 'lib/common';
import { User, Post } from 'database/models';

const Feed = db.define('feed', {
  id: primaryUUID,
  reason_type: Sequelize.STRING,
  reason_value: Sequelize.STRING,
  fk_post_id: Sequelize.UUID,
  fk_user_id: Sequelize.UUID,
});

Feed.associate = function associate() {
  Feed.belongsTo(User, { foreignKey: 'fk_user_id', onDelete: 'restrict', onUpdate: 'restrict' });
  Feed.belongsTo(Post, { foreignKey: 'fk_post_id', onDelete: 'restrict', onUpdate: 'restrict' });
};

export default Feed;
