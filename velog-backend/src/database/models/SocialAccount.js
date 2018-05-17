// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import User from './User';

const SocialAccount = db.define('social_account', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true,
  },
  /* foreignKey fk_user_id */
  social_id: Sequelize.STRING,
  access_token: Sequelize.STRING,
  provider: Sequelize.STRING,
});

SocialAccount.findBySocialId = function findBySocialId(socialId: string) {
  return SocialAccount.findOne({ where: { social_id: socialId } });
};

SocialAccount.findUserBySocialId = function findUserBySocialId(socialId: string) {
  return SocialAccount.findOne({
    include: [User],
    where: { social_id: socialId },
  }).then(data => (data ? data.user : null));
};
SocialAccount.associate = function associate() {
  SocialAccount.belongsTo(User, { foreignKey: 'fk_user_id', onDelete: 'CASCADE', onUpdate: 'restrict' });
};

export default SocialAccount;
