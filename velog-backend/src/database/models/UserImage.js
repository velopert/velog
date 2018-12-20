// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import { primaryUUID } from 'lib/common';
import { User } from 'database/models';

const UserImage = db.define(
  'user_image',
  {
    id: primaryUUID,
    fk_user_id: Sequelize.UUID,
    path: Sequelize.STRING,
    filesize: Sequelize.INTEGER,
    type: Sequelize.STRING,
    ref_id: Sequelize.UUID,
  },
  {
    indexes: [
      {
        fields: ['fk_user_id'],
      },
      {
        fields: ['type'],
      },
      {
        fields: ['ref_id'],
      },
    ],
  },
);

UserImage.associate = () => {
  UserImage.belongsTo(User, {
    foreignKey: 'fk_user_id',
    onDelete: 'CASCADE',
    onUpdate: 'restrict',
  });
};

export default UserImage;
