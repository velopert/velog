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
  likes: {
    defaultValue: 0,
    type: Sequelize.INTEGER,
  },
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
    attributes: ['id', 'title', 'body', 'thumbnail', 'is_markdown', 'created_at', 'updated_at', 'url_slug', 'likes'],
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
    attributes: ['id', 'title', 'body', 'thumbnail', 'is_markdown', 'created_at', 'updated_at', 'url_slug', 'likes'],
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
  // reusable query for COUNT & SELECT
  const query = `
    ${username ? 'JOIN users u ON p.fk_user_id = u.id' : ''}
    ${tag ? `JOIN posts_tags pt ON p.id = pt.fk_post_id
    JOIN tags t ON t.id = pt.fk_tag_id` : ''}
    ${categoryUrlSlug ? `JOIN posts_categories pc ON p.id = pc.fk_post_id
    JOIN categories c ON c.id = pc.fk_category_id` : ''}
    WHERE true
    ${username ? 'AND u.username = $username' : ''}
    ${tag ? 'AND t.name = $tag' : ''}
    ${categoryUrlSlug ? 'AND c.url_slug = $category' : ''}
  `;

  try {
    const countResult = await db.query(`SELECT COUNT(DISTINCT p.id) as count FROM posts p ${query}`, { bind: { tag, username, category: categoryUrlSlug }, type: Sequelize.QueryTypes.SELECT });
    const { count } = countResult[0];

    if (!count) return { count: 0, data: null };

    const rows = await db.query(`SELECT DISTINCT p.id, p.created_at FROM posts p
      ${query}
      ORDER BY created_at DESC
      LIMIT 10
      OFFSET ${((page || 1) - 1) * 10}
    `, { bind: { tag, username, category: categoryUrlSlug }, type: Sequelize.QueryTypes.SELECT });

    if (rows.length === 0) return { count: 0, data: null };
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
    return {
      count,
      data: fullPosts,
    };
  } catch (e) {
    throw e;
  }
};

type PublicPostsQueryInfo = {
  tag: string,
  page: number,
  option: any
};

Post.checkUrlSlugExistancy = function ({
  userId,
  urlSlug,
}) {
  return Post.count({
    where: {
      fk_user_id: userId,
      url_slug: urlSlug,
    },
  });
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

Post.prototype.like = async function like(): Promise<*> {
  return this.increment('likes', { by: 1 });
};

Post.prototype.unlike = async function like(): Promise<*> {
  return this.decrement('likes', { by: 1 });
};

Post.prototype.getTagNames = async function (): Promise<*> {
  const { id } = this;
  return Post.find({
    include: [{
      model: Tag,
      attributes: ['name'],
    }],
    where: {
      id,
    },
  });
};

Post.prototype.getCategoryIds = async function (): Promise<*> {
  const { id } = this;
  try {
    const post = await Post.findOne({
      include: [{
        model: Category,
        attributes: ['id'],
      }],
      where: {
        id,
      },
    });
    if (!post) {
      return null;
    }
    return post.categories.map(c => c.id);
  } catch (e) {
    throw e;
  }
};

export const serializePost = (data: any) => {
  const {
    id, title, body, thumbnail, is_markdown, created_at, updated_at, url_slug, likes,
  } = data;
  const tags = data.tags.map(tag => tag.name);
  const categories = data.categories.map(category => ({ id: category.id, name: category.name }));
  return {
    id, title, body, thumbnail, is_markdown,
    created_at, updated_at, tags, categories, url_slug, likes,
  };
};

export default Post;
