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
  FollowTag.belongsTo(User, { foreignKey: 'fk_user_id', onDelete: 'restrict', onUpdate: 'restrict' });
  // set to belongsTo rather than hasOne, because it expects fk_tag_id from Tag (dkw)
  FollowTag.belongsTo(Tag, { foreignKey: 'fk_tag_id', onDelete: 'restrict', onUpdate: 'restrict' });
};

export default FollowTag;
