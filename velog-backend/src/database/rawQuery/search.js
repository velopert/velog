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
  const extraQuery = (() => {
    if (!fk_user_id) return 'AND posts.is_private = false';
    if (authorized) return `AND posts.fk_user_id = '${fk_user_id}'`;
    return `AND posts.fk_user_id = '${fk_user_id}' AND posts.is_private = false`;
  })();
  const query = `
SELECT id, ts_rank(tsv, TO_TSQUERY($tsquery)) * 250 + coalesce(total_score) AS rank
FROM posts 
LEFT JOIN (select fk_post_id, SUM(score) as total_score from post_scores group by fk_post_id) as q on q.fk_post_id = posts.id 
WHERE tsv @@ TO_TSQUERY($tsquery)
AND posts.is_temp = false
${extraQuery}
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
}: SearchParameter): Promise<number> => {
  const extraQuery = (() => {
    if (!fk_user_id) return 'AND posts.is_private = false';
    if (authorized) return `AND posts.fk_user_id = '${fk_user_id}'`;
    return `AND posts.fk_user_id = '${fk_user_id}' AND posts.is_private = false`;
  })();
  const query = `
SELECT COUNT(*) as count
FROM posts 
WHERE tsv @@ TO_TSQUERY($tsquery)
AND posts.is_temp = false
${extraQuery}
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
