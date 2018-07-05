// @flow
import Sequelize from 'sequelize';
import db from 'database/db';

export const getTagsList = async () => {
  const query = `SELECT tags.name AS name, posts_count FROM (
    SELECT fk_tag_id, COUNT(fk_post_id) AS posts_count FROM posts_tags
    INNER JOIN tags ON tags.id = fk_tag_id
    GROUP BY fk_tag_id
  ) AS q
  INNER JOIN tags ON q.fk_tag_id = tags.id
  ORDER BY posts_count DESC`;

  try {
    const rows = await db.query(query, {
      type: Sequelize.QueryTypes.SELECT,
    });
  } catch (e) {
    throw e;
  }
};
