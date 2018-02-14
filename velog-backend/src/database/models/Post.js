// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import { User, Tag, Category } from 'database/models';

const { Op } = Sequelize;

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

Post.readPostById = function (id) {
  return Post.findOne({
    attributes: ['id', 'title', 'body', 'thumbnail', 'is_markdown', 'created_at', 'updated_at', 'url_slug'],
    include: [{
      model: User,
      attributes: ['username'],
    }, Tag, Category],
    where: {
      id,
    },
  });
};


type PostsQueryInfo = {
  username: ?string,
  tag: ?string,
  categoryUrlSlug: ?string,
  page: ?number
};

Post.listPosts = async function ({
  username,
  categoryUrlSlug,
  tag,
  page,
}: PostsQueryInfo) {
  const rows = await db.query(`SELECT DISTINCT p.id, p.created_at FROM posts p
    ${username ? 'JOIN users u ON p.fk_user_id = u.id' : ''}
    ${tag ? `JOIN posts_tags pt ON p.id = pt.fk_post_id
    JOIN tags t ON t.id = pt.fk_tag_id` : ''}
    ${categoryUrlSlug ? `JOIN posts_categories pc ON p.id = pc.fk_post_id
    JOIN categories c ON c.id = pc.fk_category_id` : ''}
    WHERE true
    ${username ? 'AND u.username = $username' : ''}
    ${tag ? 'AND t.name = $tag' : ''}
    ${categoryUrlSlug ? 'AND c.url_slug = $category' : ''}
    ORDER BY created_at DESC
  `, { bind: { tag, username, category: categoryUrlSlug }, type: Sequelize.QueryTypes.SELECT });
  // get postId list
  // const posts = await Post.findAll({
  //   limit: 10,
  //   order: [['created_at', 'DESC']],
  //   include: [{
  //     model: User,
  //     attributes: ['username'],
  //     where: username ? { username } : null,
  //   }, {
  //     model: Tag,
  //     where: tag ? { name: tag } : null,
  //   }, {
  //     model: Category,
  //     where: categoryUrlSlug ? { url_slug: categoryUrlSlug } : null,
  //   }],
  //   raw: true,
  // });

  if (rows.length === 0) return [];
  const postIds = rows.map(({ id }) => id);

  const fullPosts = await Post.findAll({
    include: [User, Tag, Category],
    where: {
      id: {
        $or: postIds,
      },
    },
  });
  // posts = await Promise.all();
  return fullPosts;
};

type PublicPostsQueryInfo = {
  tag: string,
  page: number,
  option: any
};

Post.listPublicPosts = function ({
  tag, page, option,
}: PublicPostsQueryInfo) {
  const limit = 10;
  return Post.findAndCountAll({
    distinct: 'id',
    order: [['created_at', 'DESC']],
    include: [{
      model: Tag,
      attributes: ['name'],
      where: tag ? { name: tag } : null,
    }],
    offset: ((!page ? 1 : page) - 1) * limit,
    limit,
  });
};

export default Post;
