import Sequelize from 'sequelize';
import db from 'database/db';
import { primaryUUID } from 'lib/common';
import { User } from 'database/models';
import pick from 'lodash/pick';

const Series = db.define(
  'series',
  {
    id: primaryUUID,
    fk_user_id: Sequelize.UUID,
    name: Sequelize.STRING,
    description: Sequelize.TEXT,
    thumbnail: Sequelize.STRING,
    url_slug: Sequelize.STRING,
  },
  {
    indexes: [
      {
        fields: ['fk_user_id'],
      },
      {
        fields: ['created_at'],
      },
      {
        fields: ['updated_at'],
      },
      {
        fields: ['fk_user_id', 'url_slug'],
      },
    ],
  },
);

Series.associate = () => {
  Series.belongsTo(User, {
    foreignKey: 'fk_user_id',
    onDelete: 'CASCADE',
    onUpdate: 'restrict',
  });
};

export const serializeSeries = data => ({
  ...pick(data, [
    'id',
    'name',
    'description',
    'thumbnail',
    'url_slug',
    'created_at',
    'updated_at',
  ]),
  user: {
    id: data.user.id,
    short_bio: data.user.user_profile.short_bio,
    username: data.user.username,
    thumbnail: data.user.user_profile.thumbnail,
  },
});

export default Series;
