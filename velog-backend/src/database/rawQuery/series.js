// @flow
import Sequelize from 'sequelize';
import db from 'database/db';

type SeriesPostCountRow = {
  id: string,
  count: number,
};

export const getSeriesPostCountList = async (
  seriesIds: string[],
): Promise<SeriesPostCountRow[]> => {
  const matches = `(${seriesIds.map(seriesId => `'${seriesId}'`).join(', ')})`;
  const query = `
  select series.id, COUNT(series_posts.fk_post_id) FROM series
  left join series_posts on series.id = series_posts.fk_series_id
  where series.id IN ${matches}
  group by series.id
`;
  try {
    const rows = await db.query(query, {
      type: Sequelize.QueryTypes.SELECT,
    });
    return rows;
  } catch (e) {
    throw e;
  }
};
