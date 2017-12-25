// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import shortid from 'shortid';

export interface EmailAuthModel {
  id: number,
  code: string,
  email: string,
  createdAt: string
}

const EmailAuth = db.define('email_auth', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  code: {
    type: Sequelize.STRING,
    unique: true,
    defaultValue: shortid.generate,
  },
  email: Sequelize.STRING,
}, {
  freezeTableName: true,
  tableName: 'email_auth',
});

EmailAuth.sync();

export default EmailAuth;
