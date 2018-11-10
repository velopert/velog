// @flow
import Sequelize from 'sequelize';
import db from 'database/db';

type TagRow = {
  name: string,
  posts_count: number,
};

export const getTagsList = async (sortBy: string): Promise<TagRow[]> => {
  const query = `SELECT tags.name AS name, posts_count FROM (
    SELECT fk_tag_id, COUNT(fk_post_id) AS posts_count FROM posts_tags
    INNER JOIN tags ON tags.id = fk_tag_id
    INNER JOIN posts ON posts.id = fk_post_id
    WHERE posts.is_private = FALSE
    AND posts.is_private = FALSE
    AND posts.is_temp = FALSE
    GROUP BY fk_tag_id
  ) AS q
  INNER JOIN tags ON q.fk_tag_id = tags.id
  ORDER BY ${sortBy === 'popular' ? 'posts_count DESC' : 'name ASC'}`;

  try {
    const rows = await db.query(query, {
      type: Sequelize.QueryTypes.SELECT,
    });
    return rows;
  } catch (e) {
    throw e;
  }
};

export const getPostsCountByTagId = async (tagId: string) => {
  const query = `SELECT COUNT(fk_post_id) AS posts_count FROM posts_tags AS pt
  INNER JOIN posts AS p ON pt.fk_post_id = p.id
  WHERE p.is_temp = FALSE
  AND pt.fk_tag_id = $tagId`;

  try {
    const rows = await db.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      bind: { tagId },
    });
    return (rows[0].posts_count: number);
  } catch (e) {
    throw e;
  }
};
