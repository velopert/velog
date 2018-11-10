// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import { Post, Tag } from 'database/models';
import { primaryUUID } from 'lib/common';

/* N:M Relationship between Posts and Tags */
const PostsTags = db.define('posts_tags', {
  id: primaryUUID,
  fk_post_id: Sequelize.UUID,
  fk_tag_id: Sequelize.UUID,
});

PostsTags.associate = function associate() {
  Post.belongsToMany(Tag, {
    onDelete: 'CASCADE',
    onUpdate: 'restrict',
    through: {
      model: PostsTags,
    },
    foreignKey: 'fk_post_id',
  });
  Tag.belongsToMany(Post, {
    onDelete: 'CASCADE',
    onUpdate: 'restrict',
    through: {
      model: PostsTags,
    },
    foreignKey: 'fk_tag_id',
  });
};

// links postId to tagIds
PostsTags.link = function link(
  postId: string,
  tagIds: Array<string>,
): Promise<*> {
  const promises = tagIds.map(tagId =>
    PostsTags.build({
      fk_post_id: postId,
      fk_tag_id: tagId,
    }).save());
  return Promise.all(promises);
};

PostsTags.addTagsToPost = async function (
  postId: string,
  tags: Array<string>,
): Promise<*> {
  try {
    const tagIds = await Tag.bulkGetId(tags);
    await this.bulkCreate(tagIds.map(tagId => ({ fk_post_id: postId, fk_tag_id: tagId })));
  } catch (e) {
    throw e;
  }
};

// removes given tags from post
PostsTags.removeTagsFromPost = async function (
  postId: string,
  tags: Array<string>,
): Promise<*> {
  if (tags.length === 0) return;
  try {
    // get tag ids
    const tagIds = await Tag.bulkGetId(tags);
    await PostsTags.destroy({
      where: {
        fk_tag_id: {
          $or: tagIds,
        },
        fk_post_id: postId,
      },
    });
  } catch (e) {
    console.log(e);
  }
};

// retrieves user's postCount per tag
type GetPostsCountParams = {
  userId: string,
  ownPost: boolean,
};

PostsTags.getPostsCount = async ({ userId, ownPost }: GetPostsCountParams) => {
  // TODO: IMPLEMENT IS_VISIBLE
  const query = `
  SELECT COUNT(post_id) AS count, tag FROM (
    SELECT t.id AS tag_id, p.id AS post_id, t.name AS tag
    FROM posts_tags AS pt
    INNER JOIN tags AS t ON t.id = pt.fk_tag_id
    INNER JOIN posts AS p ON p.id = pt.fk_post_id
    WHERE p.fk_user_id = $userId
    ${ownPost ? '' : 'AND p.is_private = false'}
    AND p.is_temp = FALSE
  ) as q GROUP BY tag
  ORDER BY count DESC, tag
  `;
  try {
    const result = await db.query(query, {
      bind: {
        userId,
      },
      type: Sequelize.QueryTypes.SELECT,
    });
    return result;
  } catch (e) {
    throw e;
  }
};

export default PostsTags;
