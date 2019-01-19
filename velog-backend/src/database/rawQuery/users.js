// @flow
import Sequelize from 'sequelize';
import db from 'database/db';

// TODO:
type UserHistoryRow = {
  id: string,
  created_at: string,
  type: 'like' | 'comment',
};

export const getUserHistory = async (
  userId: string,
  offset?: number = 0,
): Promise<UserHistoryRow[]> => {
  const query = `SELECT c.id, c.created_at, 'comment' AS type FROM comments AS c
  WHERE fk_user_id = $userId
  AND deleted = false
  UNION ALL SELECT p.id, p.created_at, 'like' AS type FROM post_likes AS p
  WHERE fk_user_id = $userId
  ORDER BY created_at DESC
  OFFSET $offset
  LIMIT 20`;
  try {
    const rows = await db.query(query, {
      bind: { offset, userId },
      type: Sequelize.QueryTypes.SELECT,
    });
    return rows;
  } catch (e) {
    throw e;
  }
};

/* SELECT c.id, c.created_at, 'comment' AS type FROM comments AS c
WHERE fk_user_id = 'C76CCC50-B34D-11E8-B01F-598F1220D1C8'
UNION ALL SELECT p.id, p.created_at, 'like' AS type FROM post_likes AS p
WHERE fk_user_id = 'C76CCC50-B34D-11E8-B01F-598F1220D1C8'
ORDER BY created_at DESC */
