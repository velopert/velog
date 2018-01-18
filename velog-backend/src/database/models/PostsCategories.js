// @flow
import Sequelize from 'sequelize';
import db from 'database/db';

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

export default PostsCategories;
