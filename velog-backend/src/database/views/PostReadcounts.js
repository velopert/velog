// @flow
import Sequelize from 'sequelize';
import db from 'database/db';

const PostReadcounts = db.define(
  'post_readcounts',
  {
    post_id: {
      type: Sequelize.UUID,
      primaryKey: true,
    },
    read_counts: Sequelize.INTEGER,
  },
  {
    timestamps: false,
  },
);

PostReadcounts.sync = () => {
  /*
CREATE VIEW post_readcounts AS (
  SELECT fk_post_id AS post_id, COUNT(fk_post_id) AS read_counts FROM post_reads
  GROUP BY fk_post_id
*/
};

export default PostReadcounts;
