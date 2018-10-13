// @flow
import Sequelize from 'sequelize';
import db from 'database/db';

type TrendingPostRow = {
  post_id: string,
  score: number,
};

// credits to SeniorDev778 dev
export const getTrendingPosts = async (
  offset?: number = 0,
): Promise<TrendingPostRow[]> => {
  const query = `SELECT fk_post_id AS post_id, SUM(score) AS score FROM post_scores
  WHERE created_at > now()::DATE - 14
  AND fk_post_id IS NOT NULL
  GROUP BY fk_post_id
  ORDER BY score DESC, fk_post_id ASC
  OFFSET $offset
  LIMIT 20`;

  try {
    const rows = await db.query(query, {
      bind: { offset },
      type: Sequelize.QueryTypes.SELECT,
    });
    return rows;
  } catch (e) {
    throw e;
  }
};

export const getTrendingPostScore = async (
  postId: string,
  days: number = 14,
) => {
  const query = `
  SELECT fk_post_id AS post_id, SUM(score) AS score FROM post_scores
  WHERE created_at > now()::DATE - ${days}
  AND fk_post_id = $postId
  GROUP BY fk_post_id`;

  try {
    const rows = await db.query(query, {
      bind: { postId, days: 14 },
      type: Sequelize.QueryTypes.SELECT,
    });

    if (rows.length === 0) return null;
    return rows[0].score;
  } catch (e) {
    throw e;
  }
};
