// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import { primaryUUID } from 'lib/common';
import { Series, Post } from 'database/models';

const SeriesPosts = db.define(
  'series_posts',
  {
    id: primaryUUID,
    fk_series_id: Sequelize.UUID,
    fk_post_id: Sequelize.UUID,
    index: Sequelize.INTEGER,
  },
  {
    freezeTableName: true,
    tableName: 'series_posts',
    indexes: [
      {
        fields: ['fk_series_id'],
      },
      {
        fields: ['fk_post_id'],
      },
    ],
  },
);

SeriesPosts.associate = () => {
  SeriesPosts.belongsTo(Post, {
    onDelete: 'CASCADE',
    onUpdate: 'restrict',
    foreignKey: 'fk_post_id',
  });
  SeriesPosts.belongsTo(Series, {
    onDelete: 'CASCADE',
    onUpdate: 'restrict',
    foreignKey: 'fk_series_id',
  });
};

SeriesPosts.append = async (
  seriesId: string,
  postId: string,
  userId: string,
) => {
  // list all series post
  const seriesPosts = await SeriesPosts.findAll({
    where: {
      fk_series_id: seriesId,
    },
    include: [Post],
    order: [['index', 'ASC']],
  });
  const nextIndex =
    seriesPosts.length === 0
      ? 1
      : seriesPosts[seriesPosts.length - 1].index + 1;
  // check already added
  const exists = seriesPosts.find(sp => sp.fk_post_id === postId);
  if (exists) {
    return exists;
  }
  const sp = await SeriesPosts.build({
    fk_user_id: userId,
    index: nextIndex,
    fk_post_id: postId,
    fk_series_id: seriesId,
  }).save();
  return sp;
};

export default SeriesPosts;
