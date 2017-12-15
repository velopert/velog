// @flow
import Sequelize from 'sequelize';
import bcrypt from 'bcryptjs';
import db from 'database/db';
import { generate } from 'lib/token';

export interface UserModel {
  id: string,
  username: string,
  email: string,
  password_hash?: string,

  static crypt(password: string): Promise<string>;
  static findUser(type: 'email' | 'username', value: string): Promise<*>;

  generateToken(): string;
  validatePassword(password: string): Promise<boolean>;
}

const User = db.define('user', {
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
  password_hash: {
    type: Sequelize.STRING,
  },
});

User.sync();

User.crypt = function crypt(password: string): Promise<string> {
  const saltRounds: number = 10;
  return bcrypt.hash(password, saltRounds);
};

User.findUser = function findUser(type: 'email' | 'username', value: string) {
  return User.findOne({ where: { [type]: value } });
};

User.prototype.generateToken = function generateToken(): Promise<string> {
  type TokenPayload = {
    id: string,
    username: string
  };

  const { id, username } : TokenPayload = this;
  return generate({ user: { id, username } });
};

User.prototype.validatePassword = function validatePassword(password: string): Promise<boolean> {
  const { password_hash } = this;
  return bcrypt.compare(password, password_hash);
};

export default User;