import Sequelize from 'sequelize';
import db from 'database/db';
import { primaryUUID } from 'lib/common';
import { User } from 'database/models';

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

export default Series;
