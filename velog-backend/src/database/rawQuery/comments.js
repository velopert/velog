// @flow
import Sequelize from 'sequelize';
import db from 'database/db';

export const getCommentCountsOfPosts = async (postIds: string[]) => {
  const conditions = postIds.map(id => `fk_post_id = '${id}'`).join('\nOR ');
  const query = `SELECT fk_post_id as fk_post_id, COUNT(fk_post_id) AS comments_count
FROM comments
WHERE deleted = false AND (${conditions})
GROUP BY fk_post_id`;
  try {
    const rows = await db.query(query, { type: Sequelize.QueryTypes.SELECT });
    return rows;
  } catch (e) {
    throw e;
  }
};
