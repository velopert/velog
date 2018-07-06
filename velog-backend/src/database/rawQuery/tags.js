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
    GROUP BY fk_tag_id
  ) AS q
  INNER JOIN tags ON q.fk_tag_id = tags.id
  ORDER BY ${sortBy === 'posts_count' ? 'posts_count DESC' : 'name ASC'}`;

  try {
    const rows = await db.query(query, {
      type: Sequelize.QueryTypes.SELECT,
    });
    return rows;
  } catch (e) {
    throw e;
  }
};
