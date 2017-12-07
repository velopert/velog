// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import User from './User';

const UserProfile = db.define('user_profile', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  /* foreignKey fk_user_id */
  display_name: Sequelize.STRING,
  short_bio: Sequelize.STRING,
  thumbnail: Sequelize.STRING,
});

UserProfile.belongsTo(User, { foreignKey: 'fk_user_id', onDelete: 'restrict', onUpdate: 'restrict' });
UserProfile.sync();

export default UserProfile;
