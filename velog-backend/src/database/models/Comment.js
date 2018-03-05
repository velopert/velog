import Sequelize from 'sequelize';
import db from 'database/db';
import { primaryUUID } from 'lib/common';
import { Post, User } from 'database/models';

const Comment = db.define('comment', {
  id: primaryUUID,
  fk_post_id: Sequelize.UUID,
  fk_user_id: Sequelize.UUID,
  text: Sequelize.TEXT,
  likes: {
    defaultValue: 0,
    type: Sequelize.INTEGER,
  },
  meta_json: Sequelize.TEXT,
  reply_to: Sequelize.UUID,
  actual_reply_to: Sequelize.UUID,
  level: {
    defaultValue: 0,
    type: Sequelize.INTEGER,
  },
  has_replies: {
    defaultValue: false,
    type: Sequelize.BOOLEAN,
  },
}, {
  indexes: [
    {
      fields: ['created_at'],
    },
  ],
});

Comment.associate = function associate() {
  Comment.belongsTo(Post, { foreignKey: 'fk_post_id', onDelete: 'restrict', onUpdate: 'restrict' });
  Comment.belongsTo(User, { foreignKey: 'fk_user_id', onDelete: 'restrict', onUpdate: 'restrict' });
};

/* COMMENT LOGIC
  1) Ordinary Comment
    - level: 0
    - replyTo: null
  2) Level 1 Comment
    - level: 1
    - replyTo: level_0_id
  3) Level 2 Comment
    - level: 2
    - replyTo: level_1_id
  4) Level 3 Comment
    - level: 3
    - replyTo: level_2_id
  5) Level 4 Comment (Try)
    - level: 3
    - replyTo: level_2_id
    - actual_reply_to: level_3_id

  LISTING LOGIC

  a. List postId=id, level:0
  b. Foreach Comments
    if hasReplies then fetch
  c. forEach comments2
    if has replies then fetch
  d. forEach comments3
    if has replies then fetch
*/
