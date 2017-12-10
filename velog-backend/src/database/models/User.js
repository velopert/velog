// @flow
import Sequelize from 'sequelize';
import bcrypt from 'bcrypt';
import db from 'database/db';
import { generate } from 'lib/token';
// export interface UserAttributes {
//   id?: string,
//   username: string,
//   email: string,
//   password_hash?: string
// }

const UserModel = db.define('user', {
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

UserModel.sync();

export default class User extends UserModel {
  static crypt(password: string): Promise<string> {
    const saltRounds: number = 10;
    return bcrypt.hash(password, saltRounds);
  }

  static getExistancy(type: 'email' | 'username', value: string) {
    return UserModel.findOne({ where: { [type]: value } });
  }

  generateToken() {

  }
}
