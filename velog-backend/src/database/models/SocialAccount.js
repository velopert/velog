// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import User from './User';

const SocialAccount = db.define('social_account', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  /* foreignKey fk_user_id */
  social_id: Sequelize.STRING,
  access_token: Sequelize.STRING,
  provider: Sequelize.STRING,
});

SocialAccount.belongsTo(User, { foreignKey: 'fk_user_id', onDelete: 'restrict', onUpdate: 'restrict' });
SocialAccount.sync();

export default SocialAccount;
