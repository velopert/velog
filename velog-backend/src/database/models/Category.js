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
  url_slug: Sequelize.STRING,
  order: Sequelize.INTEGER,
  parent: Sequelize.STRING,
  fk_user_id: Sequelize.UUID,
  private: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
}, {
  indexes: [
    {
      name: 'category_order_of_user',
      fields: ['fk_user_id', 'parent', 'order'],
    },
    {
      fields: ['url_slug'],
    },
  ],
});

Category.associate = function associate() {
  Category.belongsTo(User, { foreignKey: 'fk_user_id', onDelete: 'CASCADE', onUpdate: 'restrict' });
};

Category.countRootCategories = function countRootCategories(userId: string) {
  return Category.findAndCountAll({
    where: {
      parent: null,
      fk_user_id: userId,
    },
  }).then(data => data.count);
};

Category.checkUrlSlugExists = function (userId, urlSlug) {
  return Category.findOne({
    where: {
      fk_user_id: userId,
      url_slug: urlSlug,
    },
  });
};

Category.listAllCategories = function listAllCategories(userId: string, raw: boolean = true) {
  return Category.findAll({
    attributes: ['id', 'order', 'parent', 'private', 'name', 'url_slug'],
    order: [
      ['order', 'ASC'],
    ],
    where: {
      fk_user_id: userId,
    },
    raw,
  });
};

export default Category;

