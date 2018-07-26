// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import { primaryUUID } from 'lib/common';
import { User } from 'database/models';

const UserThumbnail = db.define('user_thumbnail', {
  id: primaryUUID,
  fk_user_id: Sequelize.UUID,
  path: Sequelize.STRING,
  filesize: Sequelize.INTEGER,
});

UserThumbnail.associate = () => {
  UserThumbnail.belongsTo(User, {
    foreignKey: 'fk_user_id',
    onDelete: 'CASCADE',
    onUpdate: 'restrict',
  });
};

export default UserThumbnail;
