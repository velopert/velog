// @flow
import Sequelize from 'sequelize';
import db from 'database/db';

type CursorPayload = {
  id: string,
  score: number,
};

type TrendingPostRow = {
  post_id: string,
  score: number,
};

// credits to SeniorDev778 dev
export const getTrendingPosts = async (cursor: ?CursorPayload): Promise<TrendingPostRow[]> => {
  const query = `SELECT fk_post_id AS post_id, SUM(score) AS score FROM post_scores
  WHERE created_at > now()::DATE - 14
  ${cursor ? 'AND fk_post_id > $id' : ''}
  GROUP BY fk_post_id
  ${cursor ? 'HAVING SUM(score) <= $score' : ''}
  ORDER BY score DESC, fk_post_id ASC
  LIMIT 8`;

  try {
    const rows = await db.query(query, {
      bind: cursor || {},
      type: Sequelize.QueryTypes.SELECT,
    });
    return rows;
  } catch (e) {
    throw e;
  }
};

export const getTrendingPostScore = async (postId: string) => {
  const query = `
  SELECT fk_post_id AS post_id, SUM(score) AS score FROM post_scores
  WHERE created_at > now()::DATE - 14
  AND fk_post_id = $postId
  GROUP BY fk_post_id`;

  try {
    const rows = await db.query(query, {
      bind: { postId },
      type: Sequelize.QueryTypes.SELECT,
    });

    if (rows.length === 0) return null;
    return rows[0].score;
  } catch (e) {
    throw e;
  }
};
