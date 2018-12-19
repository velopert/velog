// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import { primaryUUID } from 'lib/common';
import { User } from 'database/models';

const UserImages = db.define(
  'user_images',
  {
    id: primaryUUID,
    fk_user_id: Sequelize.UUID,
    path: Sequelize.STRING,
    filesize: Sequelize.INTEGER,
    type: Sequelize.STRING,
  },
  {
    indexes: [
      {
        fields: ['fk_user_id'],
      },
      {
        fields: ['type'],
      },
    ],
  },
);

UserImages.associate = () => {
  UserImages.belongsTo(User, {
    foreignKey: 'fk_user_id',
    onDelete: 'CASCADE',
    onUpdate: 'restrict',
  });
};

export default UserImages;
