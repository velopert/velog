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
  FollowUser.belongsTo(User, { foreignKey: 'fk_user_id', onDelete: 'restrict', onUpdate: 'restrict' });
  FollowUser.hasOne(User, { foreignKey: 'fk_follow_user_id', onDelete: 'restrict', onUpdate: 'restrict' });
};

export default FollowUser;
