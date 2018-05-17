// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import { primaryUUID } from 'lib/common';
import { User } from 'database/models';


const FollowUser = db.define('follow_user', {
  id: primaryUUID,
  fk_user_id: Sequelize.UUID,
  fk_follow_user_id: Sequelize.UUID,
  score: {
    type: Sequelize.INTEGER,
    default: 1,
  },
}, {
  freezeTableName: true,
  tableName: 'follow_user',
});

FollowUser.associate = function associate() {
  FollowUser.belongsTo(User, { foreignKey: 'fk_user_id', onDelete: 'CASCADE', onUpdate: 'restrict' });
  FollowUser.belongsTo(User, { foreignKey: 'fk_follow_user_id', onDelete: 'CASCADE', onUpdate: 'restrict' });
};

FollowUser.getListOfUser = function getListOfUser(userId) {
  return FollowUser.findAll({
    where: {
      fk_user_id: userId,
    },
    include: [User],
  });
};

FollowUser.serialize = function serialize(data) {
  return {
    id: data.id,
    fk_follow_user_id: data.fk_follow_user_id,
    username: data.user.username,
    created_at: data.created_at,
  };
};

export default FollowUser;
