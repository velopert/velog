// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import { Category, Post } from 'database/models';

/* N:M Relationship between Posts and Categories */
const PostsCategories = db.define('posts_categories', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true,
  },
  fk_post_id: Sequelize.UUID,
  fk_category_id: Sequelize.UUID,
});

PostsCategories.associate = function associate() {
  Post.belongsToMany(Category, {
    onDelete: 'CASCADE',
    onUpdate: 'restrict',
    through: {
      model: PostsCategories,
    },
    foreignKey: 'fk_post_id',
  });
  Category.belongsToMany(Post, {
    onDelete: 'CASCADE',
    onUpdate: 'restrict',
    through: {
      model: PostsCategories,
    },
    foreignKey: 'fk_category_id',
  });
};

// links postId to categoryIds
PostsCategories.link = function (postId: string, categoryIds: Array<string>): Promise<*> {
  const promises = categoryIds.map(categoryId => PostsCategories.build({
    fk_post_id: postId,
    fk_category_id: categoryId,
  }).save());
  return Promise.all(promises);
};

PostsCategories.addCategoriesToPost = async function (
  postId: string,
  categoryIds: Array<string>,
): Promise<*> {
  try {
    const bulkCreateQuery = categoryIds.map(categoryId => ({
      fk_post_id: postId,
      fk_category_id: categoryId,
    }));
    await this.bulkCreate(bulkCreateQuery);
  } catch (e) {
    throw e;
  }
};

PostsCategories.removeCategoriesFromPost = async function (
  postId: string,
  categoryIds: Array<string>,
): Promise<*> {
  if (categoryIds.length === 0) return;
  try {
    await PostsCategories.destroy({
      where: {
        fk_category_id: {
          $or: categoryIds,
        },
        fk_post_id: postId,
      },
    });
  } catch (e) {
    throw e;
  }
};

PostsCategories.findCategoriesByPostId = function (postId: string): Promise<*> {
  return Post.findAll({
    include: [{
      model: Category,
      attributes: ['id', 'name'],
    }],
    attributes: ['categories.id', 'categories.name'],
    where: {
      id: postId,
    },
    raw: true,
  });
};

export default PostsCategories;
