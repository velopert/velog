// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import { generate } from 'lib/token';
import UserProfile, { type UserProfileModel } from './UserProfile';

export interface UserModel {
  id: string;
  username: string;
  email: string;
  // static findUser(type: 'email' | 'username', value: string): Promise<*>,
  generateToken(): string;
  validatePassword(password: string): Promise<boolean>;
  getProfile(): Promise<UserProfileModel>;
}

const User = db.define(
  'user',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true,
    },
    username: {
      type: Sequelize.STRING,
      unique: true,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
    },
    is_certified: {
      type: Sequelize.BOOLEAN,
    },
  },
  {
    indexes: [
      {
        fields: ['username'],
      },
      {
        fields: ['email'],
      },
    ],
  },
);

User.associate = function () {
  User.hasOne(UserProfile, { foreignKey: 'fk_user_id', onDelete: 'CASCADE' });
};

User.findUser = function findUser(type: 'email' | 'username', value: string) {
  return User.findOne({ where: { [type]: value } });
};

User.prototype.getProfile = async function getProfile(): Promise<*> {
  const { id } = this;
  return UserProfile.findByUserId(id);
};

User.prototype.generateToken = async function generateToken(): Promise<string> {
  type TokenPayload = {
    id: string,
    username: string,
  };

  const { id, username }: TokenPayload = this;
  const userProfile: UserProfileModel = await UserProfile.findByUserId(id);
  if (!userProfile) {
    throw new Error('user profile not found');
  }
  const { display_name: displayName, thumbnail } = userProfile;
  const user = {
    id,
    username,
    displayName,
    thumbnail,
  };

  return generate({ user });
};

export default User;
