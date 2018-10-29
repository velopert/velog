// @flow
import Sequelize from 'sequelize';
import db from 'database/db';

type SitemapPostData = {
  id: string,
  username: string,
  url_slug: string,
  created_at: string,
  updated_at: string,
}[];
export const getPostsOfMonth = async (
  month: string,
): Promise<SitemapPostData> => {
  const regex = /^2\d{3}-\d{2}$/;
  if (!regex.test(month)) {
    const e = new Error();
    e.name = 'INVALID_DATE';
    throw e;
  }
  const query = `SELECT p.id, p.url_slug, p.created_at, p.updated_at, username FROM posts AS p
  INNER JOIN users ON p.fk_user_id = users.id
  WHERE date_trunc('month', p.created_at) = '${month}-01 00:00:00'
  AND is_temp = FALSE
  AND is_private = FALSE
  ORDER BY created_at`;

  try {
    const rows = await db.query(query, {
      type: Sequelize.QueryTypes.SELECT,
    });
    return rows;
  } catch (e) {
    throw e;
  }
};
