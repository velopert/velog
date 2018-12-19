// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import { User, Tag, Category, UserProfile } from 'database/models';
import pick from 'lodash/pick';
import { formatShortDescription } from 'lib/common';

const { Op } = Sequelize;

export type PostModel = {
  id: string,
  title: string,
  body: string,
  short_description: string,
  thumbnail: string,
  is_markdown: boolean,
  is_temp: boolean,
  meta: any,
};

const Post = db.define(
  'post',
  {
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
    fk_user_id: Sequelize.UUID,
    original_post_id: Sequelize.UUID,
    url_slug: Sequelize.STRING,
    likes: {
      defaultValue: 0,
      type: Sequelize.INTEGER,
    },
    meta: {
      type: Sequelize.JSONB,
      defaultValue: {},
    },
    views: {
      defaultValue: 0,
      type: Sequelize.INTEGER,
    },
    is_private: {
      defaultValue: true,
      type: Sequelize.BOOLEAN,
    },
    released_at: {
      defaultValue: Sequelize.fn('NOW'),
      type: Sequelize.DATE,
    },
  },
  {
    indexes: [
      {
        fields: ['url_slug'],
      },
      {
        fields: ['created_at'],
      },
      {
        fields: ['is_private'],
      },
      {
        fields: ['is_temp'],
      },
      {
        fields: ['released_at'],
      },
      {
        fields: ['fk_user_id'],
      },
    ],
  },
);

Post.associate = function associate() {
  Post.belongsTo(User, {
    foreignKey: 'fk_user_id',
    onDelete: 'CASCADE',
    onUpdate: 'restrict',
  });
};

Post.readPost = function (username: string, urlSlug: string) {
  return Post.findOne({
    attributes: [
      'id',
      'title',
      'body',
      'thumbnail',
      'is_markdown',
      'created_at',
      'updated_at',
      'released_at',
      'is_private',
      'url_slug',
      'likes',
      'meta',
    ],
    include: [
      {
        model: User,
        include: [UserProfile],
        attributes: ['username', 'id'],
        where: {
          username,
        },
      },
      Tag,
      Category,
    ],
    where: {
      url_slug: urlSlug,
    },
  });
};

Post.readPostById = function (id) {
  return Post.findOne({
    attributes: [
      'id',
      'title',
      'body',
      'thumbnail',
      'is_markdown',
      'created_at',
      'updated_at',
      'released_at',
      'url_slug',
      'likes',
      'is_temp',
      'meta',
      'is_private',
    ],
    include: [
      {
        model: User,
        include: [UserProfile],
        attributes: ['username'],
      },
      Tag,
      Category,
    ],
    where: {
      id,
    },
  });
};

type PostsQueryInfo = {
  username: ?string,
  tag: ?string,
  categoryUrlSlug: ?string,
  cursor: ?string,
  isTemp: ?boolean,
  userId: ?boolean,
};

Post.listPosts = async function ({
  username,
  categoryUrlSlug,
  tag,
  cursor,
  isTemp,
  userId,
}: PostsQueryInfo) {
  // find post with cursor
  let cursorData = null;
  if (cursor) {
    cursorData = await Post.findById(cursor);
    if (!cursorData) {
      const e = new Error('Cursor data is not found');
      e.name = 'CURSOR_NOT_FOUND';
      throw e;
    }
  }
  const cursorDate = cursorData && cursorData.released_at;
  const time = cursorDate && new Date(cursorDate).toISOString();

  // reusable query for COUNT & SELECT
  const query = `
    ${username ? 'JOIN users u ON p.fk_user_id = u.id' : ''}
    ${
  tag
    ? `JOIN posts_tags pt ON p.id = pt.fk_post_id
    JOIN tags t ON t.id = pt.fk_tag_id`
    : ''
}
    ${
  categoryUrlSlug
    ? `JOIN posts_categories pc ON p.id = pc.fk_post_id
    JOIN categories c ON c.id = pc.fk_category_id`
    : ''
}
    WHERE true
    AND (p.is_private = false OR (p.is_private = true AND p.fk_user_id = $userId))
    ${isTemp ? 'AND p.is_temp = true' : 'AND p.is_temp = false'}
    ${username ? 'AND u.username = $username' : ''}
    ${tag ? 'AND t.name = $tag' : ''}
    ${categoryUrlSlug ? 'AND c.url_slug = $category' : ''}
    ${
  cursor
    ? `
      AND p.id != $cursor
      AND p.released_at <= $time
    `
    : ''
}
  `;

  const bindVariables = {
    tag,
    username,
    category: categoryUrlSlug,
    cursor,
    userId,
    time,
  };
  try {
    const countResult = await db.query(
      `SELECT COUNT(DISTINCT p.id) as count FROM posts p ${query}`,
      { bind: bindVariables, type: Sequelize.QueryTypes.SELECT },
    );
    const { count } = countResult[0];

    if (!count) return { count: 0, data: null };

    const rows = await db.query(
      `SELECT DISTINCT p.id, p.released_at FROM posts p
      ${query}
      ORDER BY released_at DESC
      LIMIT 20
    `,
      { bind: bindVariables, type: Sequelize.QueryTypes.SELECT },
    );

    if (rows.length === 0) return { count, data: null };
    const postIds = rows.map(({ id }) => id);

    const fullPosts = await Post.findAll({
      include: [
        {
          model: User,
          include: [UserProfile],
        },
        Tag,
        Category,
      ],
      where: {
        id: {
          $or: postIds,
        },
      },
      order: [['released_at', 'DESC']],
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
  option: any,
};

Post.checkUrlSlugExistancy = function ({ userId, urlSlug }) {
  return Post.count({
    where: {
      fk_user_id: userId,
      url_slug: urlSlug,
    },
  });
};

Post.readPostsByIds = async (postIds) => {
  const fullPosts = await Post.findAll({
    include: [
      {
        model: User,
        include: [UserProfile],
      },
      Tag,
      Category,
    ],
    where: {
      id: {
        $or: postIds,
      },
    },
    order: [['released_at', 'DESC']],
  });

  const flatData = {};
  fullPosts.forEach((p) => {
    flatData[p.id] = p;
  });
  return postIds.map(postId => flatData[postId]);
};

Post.listPublicPosts = function ({ tag, page, option }: PublicPostsQueryInfo) {
  const limit = 20;
  return Post.findAndCountAll({
    distinct: 'id',
    order: [['released_at', 'DESC']],
    include: [
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

Post.prototype.like = async function like(transaction): Promise<*> {
  return this.increment('likes', { by: 1, transaction });
};

Post.prototype.unlike = async function unlike(transaction): Promise<*> {
  return this.decrement('likes', { by: 1, transaction });
};

Post.prototype.getTagNames = async function (): Promise<*> {
  const { id } = this;
  return Post.find({
    include: [
      {
        model: Tag,
        attributes: ['name'],
      },
    ],
    where: {
      id,
    },
  });
};

Post.prototype.getCategoryIds = async function (): Promise<*> {
  const { id } = this;
  try {
    const post = await Post.findOne({
      include: [
        {
          model: Category,
          attributes: ['id'],
        },
      ],
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
    id,
    title,
    body,
    thumbnail,
    is_markdown,
    created_at,
    updated_at,
    released_at,
    url_slug,
    liked,
    likes,
    comments_count,
    is_temp,
    user,
    meta,
    is_private,
  } = data;
  const tags = data.tags.map(tag => tag.name);
  const categories = data.categories.map(category => ({
    id: category.id,
    name: category.name,
    url_slug: category.url_slug,
  }));
  return {
    id,
    title,
    body,
    thumbnail,
    is_markdown,
    created_at,
    updated_at,
    released_at,
    tags,
    categories,
    url_slug,
    likes,
    comments_count,
    is_temp,
    user: {
      ...pick(user, ['id', 'username']),
      ...pick(user.user_profile, ['display_name', 'short_bio', 'thumbnail']),
    },
    meta,
    liked,
    is_private,
  };
};

export default Post;
