// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import { User, Tag, Category } from 'database/models';

export type PostModel= {
  id: string,
  title: string,
  body: string,
  short_description: string,
  thumbnail: string,
  is_markdown: boolean,
  is_temp: boolean,
  meta_json: string,
};

const Post = db.define('post', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true,
  },
  title: Sequelize.STRING,
  body: Sequelize.TEXT,
  short_description: Sequelize.STRING,
  thumbnail: Sequelize.STRING,
  is_markdown: Sequelize.BOOLEAN,
  is_temp: Sequelize.BOOLEAN,
  meta_json: Sequelize.TEXT,
  fk_user_id: Sequelize.UUID,
  original_post_id: Sequelize.UUID,
  url_slug: Sequelize.STRING,
}, {
  indexes: [
    {
      fields: ['url_slug'],
    },
  ],
});

Post.associate = function associate() {
  Post.belongsTo(User, { foreignKey: 'fk_user_id', onDelete: 'restrict', onUpdate: 'restrict' });
};

Post.readPost = function (username: string, urlSlug: string) {
  return Post.findOne({
    attributes: ['id', 'title', 'body', 'thumbnail', 'is_markdown', 'created_at', 'updated_at', 'url_slug'],
    include: [{
      model: User,
      attributes: ['username'],
      where: {
        username,
      },
    }, Tag, Category],
    where: {
      url_slug: urlSlug,
    },
  });
};
type PostsQueryInfo = {
  username: string,
  tag: ?string,
  categoryUrlSlug: ?string,
  page: ?number
};

Post.countPosts = function ({
  username,
  categoryUrlSlug,
  tag,
  page,
}: PostsQueryInfo) {

};

Post.listPosts = function ({
  username,
  categoryUrlSlug,
  tag,
  page,
}: PostsQueryInfo) {
  const limit = 10;
  return Post.findAll({
    order: [['created_at', 'DESC']],
    attributes: ['id', 'title', 'body', 'thumbnail', 'is_markdown', 'created_at', 'updated_at', 'url_slug'],
    include: [
      {
        model: User,
        attributes: ['username'],
        where: { username },
      },
      {
        model: Category,
        attributes: ['url_slug', 'name'],
        where: categoryUrlSlug ? { url_slug: categoryUrlSlug } : null,
      },
      {
        model: Tag,
        attributes: ['name'],
        where: tag ? { name: tag } : null,
      },
    ],
    offset: ((!page ? 1 : page) - 1) * limit,
    limit,
  });
};

export default Post;
