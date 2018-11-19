// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import shortid from 'shortid';

export interface EmailAuthModel {
  id: number;
  code: string;
  email: string;
  createdAt: string;
  logged: boolean;
  // static findCode(code: string): Promise<*>,
  use(): Promise<*>;
}

const EmailAuth = db.define(
  'email_auth',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true,
    },
    code: {
      type: Sequelize.STRING,
      unique: true,
      defaultValue: shortid.generate,
    },
    email: Sequelize.STRING,
    logged: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    freezeTableName: true,
    tableName: 'email_auth',
  },
);

EmailAuth.findCode = function findCode(code: string): Promise<*> {
  return EmailAuth.findOne({
    where: {
      code,
      logged: false,
    },
  });
};

EmailAuth.prototype.use = function use(): Promise<*> {
  return this.update({
    logged: true,
  });
};

export default EmailAuth;
