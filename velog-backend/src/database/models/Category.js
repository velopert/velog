// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import User from './User';

export type CategoryModel = {
  id: string,
  name: string,
  order: number,
  parent: string,
  private: boolean,
  fk_user_id: string,
};

const Category = db.define('category', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  order: Sequelize.INTEGER,
  parent: Sequelize.STRING,
  fk_user_id: Sequelize.UUID,
  private: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

Category.associate = function associate() {
  Category.belongsTo(User, { foreignKey: 'fk_user_id', onDelete: 'restrict', onUpdate: 'restrict' });
};

export default Category;

