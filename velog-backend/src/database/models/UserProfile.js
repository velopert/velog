// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import User from './User';

export interface UserProfileModel {
  id: number,
  display_name: string,
  short_bio: string,
  thumbnail: string
}

const UserProfile = db.define('user_profile', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true,
  },
  /* foreignKey fk_user_id */
  display_name: Sequelize.STRING,
  short_bio: Sequelize.STRING,
  thumbnail: Sequelize.STRING,
});

UserProfile.associate = function associate() {
  UserProfile.belongsTo(User, { foreignKey: 'fk_user_id', onDelete: 'restrict', onUpdate: 'restrict' });
};

UserProfile.findByUserId = function findByUserId(userId: string) {
  return this.findOne({
    where: {
      fk_user_id: userId,
    },
  });
};

export default UserProfile;
