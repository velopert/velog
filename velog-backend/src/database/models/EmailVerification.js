// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import shortid from 'shortid';

export interface EmailVerificationModel {
  id: number,
  code: string,
  email: string,
  createdAt: string
}

const EmailVerification = db.define('email_verification', {
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
});

EmailVerification.sync();

export default EmailVerification;
