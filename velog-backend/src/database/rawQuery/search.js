// @flow
import Sequelize from 'sequelize';
import db from 'database/db';

type SearchParameter = {
  tsquery: string,
  fk_user_id?: string,
  authorized?: boolean,
  page?: number,
};

type SearchDataRow = {
  id: string,
  rank: number,
};

export const searchPosts = async ({
  tsquery,
  fk_user_id,
  authorized,
  page = 1,
}: SearchParameter): Promise<SearchDataRow[]> => {
  const query = `
SELECT id, ts_rank(tsv, TO_TSQUERY($tsquery)) * 1000 + total_score AS rank
FROM posts 
JOIN (select fk_post_id, SUM(score) as total_score from post_scores group by fk_post_id) as q on q.fk_post_id = posts.id 
WHERE tsv @@ TO_TSQUERY($tsquery)
ORDER BY rank DESC
OFFSET ${10 * (page - 1)}
LIMIT 10
  `;

  try {
    const rows = await db.query(query, {
      bind: { tsquery },
    });
    return rows[0];
  } catch (e) {
    throw e;
  }
};

export const countSearchPosts = async ({
  tsquery,
  fk_user_id,
  authorized,
  page = 1,
}: SearchParameter): Promise<number> => {
  const query = `
SELECT COUNT(*) as count
FROM posts 
WHERE tsv @@ TO_TSQUERY($tsquery)
  `;

  try {
    const rows = await db.query(query, {
      bind: { tsquery },
    });
    return rows[0][0].count;
  } catch (e) {
    throw e;
  }
};
