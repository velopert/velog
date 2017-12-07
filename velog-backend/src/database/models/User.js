// @flow
import Sequelize from 'sequelize';
import db from 'database/db';

// export interface UserAttributes {
//   id?: string,
//   username: string,
//   email: string,
//   password_hash?: string
// }

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

export default User;
