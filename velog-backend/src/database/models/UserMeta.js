import Sequelize from 'sequelize';
import db from 'database/db';
import User from 'database/models/User';

const UserMeta = db.define(
  'user_meta',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true,
    },
    fk_user_id: {
      type: Sequelize.UUID,
    },
    email_notification: {
      defaultValue: false,
      type: Sequelize.BOOLEAN,
    },
    email_promotion: {
      defaultValue: false,
      type: Sequelize.BOOLEAN,
    },
  },
  {
    freezeTableName: true,
    tableName: 'user_meta',
    indexes: [
      {
        fields: ['fk_user_id'],
      },
    ],
  },
);

UserMeta.associate = function associate() {
  UserMeta.belongsTo(User, {
    foreignKey: 'fk_user_id',
    onDelete: 'CASCADE',
    onUpdate: 'restrict',
  });
};

export default UserMeta;
