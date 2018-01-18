// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import User from './User';
import Post from './Post';
import PostsCategories from './PostsCategories';

export type CategoryModel = {
  id: string,
  name: string,
  order: number,
  parent: string,
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
});

Category.associate = function associate() {
  Category.belongsTo(User, { foreignKey: 'fk_user_id', onDelete: 'restrict', onUpdate: 'restrict' });
  Category.belongsToMany(Post, {
    onDelete: 'restrict',
    onUpdate: 'restrict',
    through: {
      model: PostsCategories,
    },
    foreignKey: 'fk_category_id',
  });
};

export default Category;

