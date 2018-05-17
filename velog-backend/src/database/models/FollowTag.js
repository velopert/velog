// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import { primaryUUID } from 'lib/common';
import { User, Tag } from 'database/models';


const FollowTag = db.define('follow_tag', {
  id: primaryUUID,
  fk_user_id: Sequelize.UUID,
  fk_tag_id: Sequelize.UUID,
  score: {
    type: Sequelize.INTEGER,
    default: 1,
  },
}, {
  freezeTableName: true,
  tableName: 'follow_tag',
});

FollowTag.associate = function associate() {
  FollowTag.belongsTo(User, { foreignKey: 'fk_user_id', onDelete: 'CASCADE', onUpdate: 'restrict' });
  // set to belongsTo rather than hasOne, because it expects fk_tag_id from Tag (dkw)
  FollowTag.belongsTo(Tag, { foreignKey: 'fk_tag_id', onDelete: 'CASCADE', onUpdate: 'restrict' });
};

FollowTag.getListOfUser = function getListOfUser(userId) {
  return FollowTag.findAll({
    where: {
      fk_user_id: userId,
    },
    include: [Tag],
  });
};

FollowTag.serialize = function serialize(data) {
  return {
    id: data.id,
    fk_tag_id: data.fk_tag_id,
    name: data.tag.name,
    create_at: data.created_at,
  };
};

export default FollowTag;
